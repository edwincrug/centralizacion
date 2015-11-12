registrationModule.controller("nodoController", function ($scope, $rootScope, localStorageService, alertFactory, nodoRepository, documentoRepository, alertaRepository) {

    //Propiedades
    $scope.isLoading = false;
    $scope.idProceso = 1;
    $scope.perfil = 1;

    //Deshabilitamos el clic derecho en toda la aplicación
    window.frames.document.oncontextmenu = function(){ alertFactory.error('Función deshabilitada en digitalización.'); return false; };

    //Mensajes en caso de error
    var errorCallBack = function (data, status, headers, config) {
        $('#btnEnviar').button('reset');
        alertFactory.error('Ocurrio un problema');
    };

    //Grupo de funciones de inicio
    $scope.init = function () {
        //Variable controladora de loading

        //Obtenemos la lista de nodos completos
        ObtieneNodos(getParameterByName('id'),$scope.idProceso,$scope.perfil);
    };

    ////////////////////////////////////////////////////////////////////////////
    //Genero Nodos
    ////////////////////////////////////////////////////////////////////////////
    var ObtieneNodos = function(folio,idproceso,idprocesoidproceso) {
        nodoRepository.getAll(folio,idproceso,idproceso)
            .success(obtieneNodosSuccessCallback)
            .error(errorCallBack);
    };

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
        $scope.currentPage = 1;
    };

    ////////////////////////////////////////////////////////////////////////////
    //Gestión de nodos y validación
    ////////////////////////////////////////////////////////////////////////////

    //Reacciona a los triggers de NEXT PREV CLIC
    var goToPageTrigger = function(button){
        //Veo la página actual
        $scope.currentPage = $('ul#standard').roundabout("getChildInFocus") + 1;
        if($scope.listaNodos[$scope.currentPage - 1].enabled != 0){
            goToPage($scope.currentPage);
        }
        else{
            alertFactory.warning('Nodo ' + $scope.currentPage + ' no disponible para su perfil.');
            $(button).click();
        }
    };

    //LLeva a un nodo específico desde la navegación
    $scope.setPage = function(inner,nodo) {
        if(nodo.enabled != 0){
            $scope.currentPage = inner.currentTarget.innerText;
            goToPage($scope.currentPage);  
        }
        else{
            alertFactory.warning('Nodo ' + $scope.currentPage + ' no disponible para su perfil.');
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

    var getAlertasSuccessCallback = function (data, status, headers, config) {
        $scope.isLoading = false; 
        $scope.listaAlertas = data;
        Apply();
    };

    var getDocumentosSuccessCallback = function (data, status, headers, config) {
        $scope.listaDocumentos = data;
        alertaRepository.getByNodo($scope.idProceso, $scope.currentNode.id,$scope.currentNode.folio)
            .success(getAlertasSuccessCallback)
            .error(errorCallBack);
    };

    var LoadActiveNode = function(){
        $scope.isLoading = true;
        Apply();

        documentoRepository.getByNodo($scope.currentNode.id,$scope.currentNode.folio,$scope.perfil)
            .success(getDocumentosSuccessCallback)
            .error(errorCallBack);
    };

    //Ejecuta un apply en funciones jQuery
    var Apply = function() {
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
            $scope.$apply();
    };

});
