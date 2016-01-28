registrationModule.controller("nodoController", function ($scope, $rootScope, localStorageService, alertFactory, nodoRepository, documentoRepository, alertaRepository, empleadoRepository) {

    //Propiedades
    $scope.isLoading = false;
    $scope.idProceso = 1;
    $scope.perfil = 1;

    //Deshabilitamos el clic derecho en toda la aplicación
    //window.frames.document.oncontextmenu = function(){ alertFactory.error('Función deshabilitada en digitalización.'); return false; };

    //Mensajes en caso de error
    var errorCallBack = function (data, status, headers, config) {
        $('#btnEnviar').button('reset');
        alertFactory.error('Ocurrio un problema');
    };

    //Grupo de funciones de inicio
    $scope.init = function () {

        getEmpleado();
        //Obtengo los datos del empleado loguado
        empleadoRepository.get($rootScope.currentEmployee)
            .success(getEmpleadoSuccessCallback)
            .error(errorCallBack);
    };

    $rootScope.CargaEmpleado = function(id){
        getEmpleado();
        $scope.id = id;
        //localStorageService.add('idFolio',id); //LQMA
        empleadoRepository.get($rootScope.currentEmployee)
            .success(getEmpleadoSuccessCallback)
            .error(errorCallBack);
    };

    //Obtiene el empleado actual
    var getEmpleado = function(){
        if(getParameterByName('employee') != ''){
            $rootScope.currentEmployee = getParameterByName('employee');
        }

        if ($rootScope.currentEmployee == null){
            var idEmpleado = prompt("Ingrese un número de empleado", 1);
            $rootScope.currentEmployee = idEmpleado;
        }
    };

    var getEmpleadoSuccessCallback = function (data, status, headers, config) {
        $rootScope.empleado = data;
        //Obtenemos la lista de nodos completos
        if($rootScope.empleado != null){
                $scope.folio = getParameterByName('id') != '' ? getParameterByName('id') : $scope.id; //localStorageService.get('idFolio');
                //Obtengo el encabezado del expediente
                //LQMA variable para controlar que entra por busqueda y no por navegacion
                $scope.navegacion = false; 

                if($scope.folio){
                    nodoRepository.getHeader($scope.folio,$rootScope.empleado.idUsuario)
                        .success(obtieneHeaderSuccessCallback)
                        .error(errorCallBack);
                }
                else
                {                    
                    $('#slide').click();
                    //angular.element('#slide').triggerHandler('click');
                }
        }
        else
            alertFactory.error('El empleado no existe en el sistema.');
        
    };   

    //LQMA funcion para cada folio dentro del pop remisiones-facturas
    $scope.navegaFolio = function(folio)
    {
        $scope.navegacion = true; //LQMA true: entro desde

        //alert(folio.folionuevo);
        $('#navegaLinks').modal('hide');
        $scope.folio = folio.folionuevo;

        nodoRepository.getHeader($scope.folio,$rootScope.empleado.idUsuario)
                        .success(obtieneHeaderSuccessCallback)
                        .error(errorCallBack);

    };

    //Success al obtener expediente
    var obtieneHeaderSuccessCallback = function (data, status, headers, config) {
        //LQMA variable controla inicio nodos
        $scope.iniciaNodos = 0;

        //Asigno el objeto encabezado
        $scope.expediente = data;   //LQMA la propiedad $scope.expediente.nodoActual se actualiza con el data, checar si viene de otro link para poner en el nodo seleccionado
        if($scope.expediente != null){
            //Obtengo la información de los nodos            
            nodoRepository.getAll($scope.folio,$scope.idProceso,$rootScope.empleado.idPerfil)
                .success(obtieneNodosSuccessCallback)
                .error(errorCallBack);
        }
        else
            alertFactory.error('No existe información para este expediente.');
    };

    //Abre una orden padre o hijo
    $scope.VerOrdenPadre = function(exp){
        location.href = '/?id=' + exp.folioPadre + '&employee=1';
    };

    $scope.VerOrdenHijo = function(exp){
        location.href = '/?id=' + exp.folioHijo + '&employee=1';
    };

    ////////////////////////////////////////////////////////////////////////////
    //Genero Nodos
    ////////////////////////////////////////////////////////////////////////////
    var obtieneNodosSuccessCallback = function (data, status, headers, config) {
        //$scope.listaNodos = _Nodes;
        $scope.listaNodos = data;
        //$scope.numElements = _Nodes.length;
        $scope.numElements = data.length;
        //leo la página inicial y voy a ella
        GetCurrentPage();

        setTimeout(function(){ 
            $('ul#standard').roundabout({
                btnNext: ".next",
                btnNextCallback: function(){
                    goToPageTrigger('.next');
                },
                btnPrev: ".prev",
                btnPrevCallback: function(){
                    goToPageTrigger('.prev');
                },
                clickToFocusCallback: function(){
                    goToPageTrigger('.next');
                }
            });
            //Voy a la página actual
            goToPage($scope.currentPage);

        },1);
    };

    var GetCurrentPage = function(){
        $scope.currentPage = $scope.expediente.nodoActual;
    };

    ////////////////////////////////////////////////////////////////////////////
    //Gestión de nodos y validación
    ////////////////////////////////////////////////////////////////////////////

    //Reacciona a los triggers de NEXT PREV CLIC
    var goToPageTrigger = function(button){        
        //Veo la página actual
        //yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy LQMA
        //if($scope.expediente.esPlanta == 1)
            //navegacionRemFac($scope.currentPage,$('ul#standard').roundabout("getChildInFocus") + 1);

        //YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
        $scope.currentPage = $('ul#standard').roundabout("getChildInFocus") + 1;
        if($scope.listaNodos[$scope.currentPage - 1].enabled != 0){
            goToPage($scope.currentPage);
        }
        else{
            alertFactory.warning('El nodo ' + $scope.currentPage + ' no está disponible para su perfil.');
            $(button).click();
        }
    };

    //LLeva a un nodo específico desde la navegación
    $scope.setPage = function(nodo) {
        if(nodo.enabled != 0){
            //yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy  LQMA
            //if($scope.expediente.esPlanta == 1)
                //navegacionRemFac($scope.currentPage,nodo.id);
            //YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
            $scope.currentPage = nodo.id;
            goToPage($scope.currentPage);  
        }
        else{
            alertFactory.warning('Nodo ' + $scope.currentPage + ' no disponible para su perfil.');
        }    
    };

    //LQMA 
    var navegacionRemFac = function(origen, destino) {

        var inicio = global_settings.nodoSaltoRefacciones[0];
        var fin = global_settings.nodoSaltoRefacciones[1];

        var tipoFolio = 0,tipoReturn = 0;

        //var origen = $scope.currentPage;//$scope.currentPage_aux;
        //var destino = nodo.id;//$scope.currentPage;

        if(origen < inicio && destino > fin) //mostrar remisiones (ordenes compra - remisiones)
        {
            alert('(ordenes compra - remisiones)');
            tipoFolio = 1; //OC
            tipoReturn = 2; //RE
        }
        if(origen > fin && destino < inicio) //mostrar remisiones (facturas - remisiones)
        {
            alert('(facturas - remisiones)');
            tipoFolio = 3; //FA
            tipoReturn = 2; //RE
        }
        if((origen < inicio) && (destino >= inicio) && (destino <= fin))
        {               
            alert('Remisiones Hi Hi Hi');
            tipoFolio = 1; //OC
            tipoReturn = 2; //RE
        }       
        if((origen >= inicio && origen <= fin) && (destino > fin))
        {
            alert('Facturas hAHeHE');
            tipoFolio = 2; //RE
            tipoReturn = 3; //FA
        }        
        if((origen >fin) && (destino >= inicio && destino <= fin)) 
        {
            alert('Remisiones HoHoHooo');
            tipoFolio = 3; //FA
            tipoReturn = 2; //RE
        }
        if(((origen  >= inicio) && (origen <= fin)) && destino < inicio)
        {
            alert('Ordenes Pow!');
            tipoFolio = 2; //RE
            tipoReturn = 1; //OC
        }

        //llamar a sp y mostrar div
        if(tipoFolio != 0 && tipoReturn != 0)
        {
            nodoRepository.getNavegacion($scope.folio,tipoFolio,tipoReturn)
                .success(getNavegacionSuccessCallback)
                .error(errorCallBack);
        }
    };

    //Ir a una página específica
    var goToPage = function(page) {      
            
            $('ul#standard').roundabout("animateToChild", (page - 1));
            $scope.currentNode = $scope.listaNodos[page - 1];
            //Marco el nodo activo en NavBar
            SetActiveNav();
            //Cargo el contenido de nodo
            LoadActiveNode();
            
            //LQMA nodos iniciados
            $scope.iniciaNodos = 1;
    };

    //Establece la clase de navegación del nodo actual
    var SetActiveNav = function(){
        angular.forEach($scope.listaNodos, function(value, key) {
            if(key == ($scope.currentPage - 1))
                value.active = 1;
            else
                value.active = 0;
        });
        //Ejecuto apply
        Apply();
    }

    /////////////////////////////////////////////////////////////////////////
    //Obtengo la lista de documentos disponibles por nodo
    /////////////////////////////////////////////////////////////////////////
    //Success de carga de alertas
    var getAlertasSuccessCallback = function (data, status, headers, config) {
        $scope.isLoading = false; 
        $scope.listaAlertas = data;
        Apply();
    };

    //Success de obtner documentos por nodo
    var getDocumentosSuccessCallback = function (data, status, headers, config) {
        $scope.listaDocumentos = data;
        alertaRepository.getByNodo($scope.idProceso, $scope.currentNode.id,$scope.currentNode.folio)
            .success(getAlertasSuccessCallback)
            .error(errorCallBack);
    };

    //Carga los documentos del nodo activo
    var LoadActiveNode = function(){
        if($scope.currentNode.estatus != 1){
            $scope.isLoading = true;
            Apply();
            //Consulta el repositorio
            documentoRepository.getByNodo($scope.currentNode.id,$scope.currentNode.folio,$scope.perfil)
                .success(getDocumentosSuccessCallback)
                .error(errorCallBack);
        }
        else
            alertFactory.warning('El nodo ' + $scope.currentNode.id + ' aún no se activa para el expediente actual. No existen documentos para mostrar.')
    };

    //Ejecuta un apply en funciones jQuery
    var Apply = function() {
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
            $scope.$apply();
    };

    //Success de obtner navegacion por nodo LQMA
    var getNavegacionSuccessCallback = function (data, status, headers, config) {
        $rootScope.linksNavegacion = data;
        $('#navegaLinks').modal('show');
    };

    ///

});
