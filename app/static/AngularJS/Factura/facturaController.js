registrationModule.controller("facturaController", function ($scope, $rootScope, localStorageService, alertFactory, documentoRepository, alertaRepository, empleadoRepository, facturaRepository) {

      //Mensajes en caso de error
    var errorCallBack = function (data, status, headers, config) {
        $('#btnConfirmar').button('reset');        
        alertFactory.error('Ocurrio un problema');
    };

    //Grupo de funciones de inicio
    $scope.init = function () {
        
        getFolio();
        getEmpleado();
        $scope.consultaInicial = 1;
        //$scope.respuesta = "1";
        $scope.respuesta = {
            opcion : '1'
        };        
    };

	var getFolio = function(){
        if(getParameterByName('id') != ''){
            $rootScope.currentFolioFactura = getParameterByName('id');
        }

        if ($rootScope.currentFolioFactura == null){
            var idFolioFactura = prompt("Ingrese un folio de orden", 1);
            $rootScope.currentFolioFactura = idFolioFactura;
        }
    };

    var getEmpleado = function(){
        if(getParameterByName('employee') != ''){
            $rootScope.currentEmployee = getParameterByName('employee');
        }

        if ($rootScope.currentEmployee == null){
            var idEmpleado = prompt("Ingrese un número de empleado", 1);
            $rootScope.currentEmployee = idEmpleado;
        }

        //setTimeout(function(){ 
        facturaRepository.getDoc($rootScope.currentFolioFactura,$rootScope.currentEmployee,20) //se busca que exista la factura (id = 20) para mostrar
            .success(getDocSuccessCallback)
            .error(errorCallBack);
            //},2000);
    };

    var getDocSuccessCallback = function (data, status, headers, config) {        
        if(data != null){
                if(data != '')
                {
                    //$scope.documento = data;
                    $scope.documentoIni = '<div><object id="ifDocument" data="' + data + '" type="application/pdf" width="100%"><p>Alternative text - include a link <a href="' + data + '">to the PDF!</a></p></object> </div>';
                                     // '<div class="izquierda"><object id="ifDocument" data="' + data + '" type="application/pdf" width="100%"><p>Alternative text - include a link <a href="' + data + '">to the PDF!</a></p></object> </div>';
                                     //+ '<div class="derecha"><object id="ifDocument2" data="http://es.tldp.org/COMO-INSFLUG/es/pdf/Linuxdoc-Ejemplo.pdf" type="application/pdf" width="100%"><p>Alternative text - include a link <a href="http://es.tldp.org/COMO-INSFLUG/es/pdf/Linuxdoc-Ejemplo.pdf">to the PDF!</a></p></object></div>';

                    facturaRepository.getDoc($rootScope.currentFolioFactura,$rootScope.currentEmployee,15) //se busca que exista la factura (id = 15) para mostrar
                        .success(getDocRecepcionIniSuccessCallback)
                        .error(errorCallBack);
                    //$("#divDocumento").append(documento);
                    $('#btnSalir').hide();
                }
                else{
                    alertFactory.warning('Aun no se ha subido la Factura de este folio.');
                    var documento = '<div class="noExiste"><b> El documento aun no esta disponible </b> </div>';
                    $("#divDocumento").append(documento);
                    $("#divControles").hide();

                    //alertFactory.success('Que tenga buen día');
                    //setTimeout(function(){window.close();},3000);
                }
        }
        else{
            alertFactory.warning('Aun no se ha subido la Factura de este folio.');     
            var documento = '<div class="noExiste"><b> El documento aun no esta disponible </b> </div>';
            $("#divDocumento").append(documento);
            $("#divControles").hide();  
        } 
    };


    var getDocRecepcionIniSuccessCallback = function(data, status, headers, config) {
      if(data != null){
                if(data != '')
                {
                    var typeAplication = $rootScope.obtieneTypeAplication(data);

                    $scope.documentoIni = $scope.documentoIni.replace('<div>','<div class="izquierda">') + ' ' +
                                            '<div class="derecha"><object id="ifDocument2" data="' + data + '" type="' + typeAplication + '" width="100%"><p>Error al cargar el documento. Intente de nuevo.</a></p></object></div>';

                    /*if($scope.consultaInicial == 1)
                        $("#divControles").hide();*/
                }
            }

        $("#divDocumento").append($scope.documentoIni);
    };

    $scope.Confirmar = function() {        

        facturaRepository.getDoc($rootScope.currentFolioFactura,$rootScope.currentEmployee,15) //se busca que exista recepcion factura (id = 15)
            .success(getDocRecepcionSuccessCallback)
            .error(errorCallBack);
    };

    var getDocRecepcionSuccessCallback = function(data, status, headers, config) {
      if(data != null){
                if(data != '')
                {
                    facturaRepository.setFactura($rootScope.currentFolioFactura,$rootScope.currentEmployee,$scope.respuesta.opcion) //se busca que exista recepcion factura (id = 15)
                        .success(setFacturaSuccessCallback)
                        .error(errorCallBack);
                }
                else
                    alertFactory.warning('Debe subir el documento de Recepción de Factura.');
        }
        else
            alertFactory.warning('No existe informacion para este folio.');
    };

    var setFacturaSuccessCallback = function(data, status, headers, config) {
      if(data != null){
                if(data == 0)
                {
                    alertFactory.success('Confirmación exitosa.');
                    $rootScope.cierraVentana();
                    
                }
                else
                    alertFactory.error('Ocurrio un error al guardar. Intente de nuevo');
        }
        else
            alertFactory.warning('No existe informacion para este folio.');
    };

    $rootScope.muestraDocumentos = function(){
        //alert('Hola desde factura controller');
        $("#divDocumento").empty();

        $scope.consultaInicial = 0;

        facturaRepository.getDoc($rootScope.currentFolioFactura,$rootScope.currentEmployee,20) //se busca que exista la factura (id = 20) para mostrar
            .success(getDocSuccessCallback)
            .error(errorCallBack);
    };

    $rootScope.cierraVentana = function() {
        alertFactory.success('Que tenga buen día');
        setTimeout(function(){window.close();},2500);
    };    

});