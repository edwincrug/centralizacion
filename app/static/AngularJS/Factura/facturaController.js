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
                    var documento = '<object id="ifDocument" data="' + data + '" type="application/pdf" width="100%" height="100%"><p>Alternative text - include a link <a href="' + data + '">to the PDF!</a></p></object>';
                    $("#divDocumento").append(documento);
                }
                else{
                    alertFactory.warning('Aun no se ha subido la Factura de este folio.');
                    var documento = '<div class="noExiste"><b> El documento aun no esta disponible </b> </div>';
                    $("#divDocumento").append(documento);
                }
        }
        else
            alertFactory.warning('No existe informacion para este folio.');        
    };

    $scope.Confirmar = function() {
        //var respuesta = element(by.binding('respuesta.opcion'));
        alert($scope.respuesta.opcion);

        facturaRepository.getDoc($rootScope.currentFolioFactura,$rootScope.currentEmployee,15) //se busca que exista recepcion factura (id = 15)
            .success(getDocRecepcionSuccessCallback)
            .error(errorCallBack);
    };

    var getDocRecepcionSuccessCallback = function(data, status, headers, config) {
      if(data != null){
                if(data != '')
                {
                    facturaRepository.setFactura($rootScope.currentFolioFactura,$rootScope.currentEmployee,$scope.respuesta.opcion) //se busca que exista recepcion factura (id = 15)
                        .success(getDocRecepcionSuccessCallback)
                        .error(errorCallBack);
                }
                else
                    alertFactory.warning('Debe subir el documento de Recepción de Factura.');
        }
        else
            alertFactory.warning('No existe informacion para este folio.');
    };

});