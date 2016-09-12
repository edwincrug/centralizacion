registrationModule.controller("searchController", function ($scope, $rootScope, $location, localStorageService, alertFactory, searchRepository) {

    //Propiedades
    $rootScope.searchlevel = 1;

    //Desconfiguramos el clic izquierdo en el frame contenedor de documento
    var errorCallBack = function (data, status, headers, config) {
        $('#btnEnviar').button('reset');
        $('#btnBuscar').button('reset');
        alertFactory.error('Ocurrio un problema');

    };

    if ($location.path() === "/factura") {
        $scope.buttonMenuVisible = false;
    } else {
        $scope.buttonMenuVisible = true;
    }

    //Grupo de funciones de inicio
    $scope.init = function () {
        //$rootScope.hasExp = true;
        $scope.loadDivision();
        $scope.loadTipos();
    };

    $scope.Search = function () {

        //alert($scope.dt1);

        //LQMA 21012016 se agrego funcionalidad de busqueda de folios    $rootScope.division == null && 
        if ($rootScope.empresa == null && $rootScope.agencia == null && $rootScope.departamento == null && ($scope.folioBusca == null || $scope.folioBusca == '') && $rootScope.proveedor == null && $rootScope.tipo == null && $scope.dt1 == null && $scope.dt2 == null) {
            alertFactory.warning('Debe proporcionar al menos alguno de los filtros de busqueda.');
        } else {

            /*alert($rootScope.division.idDivision);
            alert($rootScope.empresa.idEmpresa);
            alert($rootScope.agencia.idSucursal);
            alert($rootScope.departamento.idDepartamento);*/

            var emp = ($rootScope.empresa == null ? 0 : $rootScope.empresa.idEmpresa);
            var suc = ($rootScope.agencia == null ? 0 : $rootScope.agencia.idSucursal);
            var dep = ($rootScope.departamento == null ? 0 : $rootScope.departamento.idDepartamento);
            var folio = ($scope.folioBusca == null ? '' : $scope.folioBusca);
            var prov = ($rootScope.proveedor == null ? 0 : $rootScope.proveedor.idProveedor);
            var tipoOrd = ($rootScope.tipo == null ? -1 : $rootScope.tipo.idtipoorden);

            //var fechaString = $scope.dt1.format("yyyymmdd");

            var fecha1 = ($scope.dt1 == null ? null : $scope.dt1.format("yyyymmdd"));
            var fecha2 = ($scope.dt2 == null ? null : $scope.dt2.format("yyyymmdd"));

            //alert(fecha2);

            $('#btnBuscar').button('loading');
            searchRepository.getFolios(folio, emp, suc, dep, tipoOrd, prov, fecha1, fecha2)
                .success(getFoliosSuccessCallback)
                .error(errorCallBack);
        }
    };

    //Script para salir
    ///////////////////////////////////////////////////////////////////////////
    $scope.Salir = function () {
        var ventana = window.self;
        ventana.opener = window.self;
        ventana.close();
    };

    $scope.CloseGrid = function () {
        $("#finder").animate({
            width: "hide"
        });
        //$rootScope.hasExp = true;
    };

    $scope.HideView = function () {
        //$rootScope.hasExp = false;
    };

    ///////////////////////////////////////////////////////////////////////////
    //Carga los tipos de órden de compra
    $scope.loadTipos = function () {
        searchRepository.getTipos()
            .success(getTiposSuccessCallback)
            .error(errorCallBack);
    };

    var getTiposSuccessCallback = function (data, status, headers, config) {
        $rootScope.listaTipos = data;
    }

    $scope.SetTipo = function (tip) {
        $rootScope.tipo = tip;
    };

    $scope.ClearTipo = function () {
        $rootScope.tipo = null;
    };

    //////////////////////////////////////////////////////////////////////////
    //Establece la división
    //////////////////////////////////////////////////////////////////////////
    var getDivisionSuccessCallback = function (data, status, headers, config) {
        $rootScope.listaDivisiones = data;
    }

    $scope.loadDivision = function () {
        searchRepository.getDivision()
            .success(getDivisionSuccessCallback)
            .error(errorCallBack);
    }

    $scope.SetDivision = function (div) {
        $scope.ClearDivision();
        $rootScope.division = div;
        $rootScope.searchlevel = 2;
        $scope.LoadEmpresa();
    };

    $scope.ClearDivision = function () {
        $rootScope.division = null;
        $rootScope.searchlevel = 1;
        $rootScope.empresa = null;
        $rootScope.agencia = null;
        $rootScope.departamento = null;
    }

    //////////////////////////////////////////////////////////////////////////
    //Establece la empresa
    //////////////////////////////////////////////////////////////////////////
    var getEmpresaSuccessCallback = function (data, status, headers, config) {
        $rootScope.listaEmpresas = data;
    }

    $scope.LoadEmpresa = function () {
        searchRepository.getEmpresa($rootScope.empleado.idUsuario)
            .success(getEmpresaSuccessCallback)
            .error(errorCallBack);
    }

    $scope.SetEmpresa = function (emp) {
        $scope.ClearEmpresa();
        $rootScope.empresa = emp;
        $rootScope.searchlevel = 3;
        $scope.LoadAgencia();
    };

    $scope.ClearEmpresa = function () {
        $rootScope.empresa = null;
        $rootScope.searchlevel = 2;
        $rootScope.agencia = null;
        $rootScope.departamento = null;
    }

    //////////////////////////////////////////////////////////////////////////
    //Establece la agencia
    //////////////////////////////////////////////////////////////////////////
    var getAgenciaSuccessCallback = function (data, status, headers, config) {
        $rootScope.listaAgencias = data;
    }

    $scope.LoadAgencia = function () {
        searchRepository.getSucursal($rootScope.empleado.idUsuario, $rootScope.empresa.idEmpresa)
            .success(getAgenciaSuccessCallback)
            .error(errorCallBack);
    }

    $scope.SetAgencia = function (age) {
        $scope.ClearAgencia();
        $rootScope.agencia = age;
        $rootScope.searchlevel = 4;
        $scope.LoadDepartamento();
    };

    $scope.ClearAgencia = function () {
        $rootScope.agencia = null;
        $rootScope.searchlevel = 3;
        $rootScope.departamento = null;
    }

    //////////////////////////////////////////////////////////////////////////
    //Departamento
    //////////////////////////////////////////////////////////////////////////
    var getDepartamentoSuccessCallback = function (data, status, headers, config) {
        $rootScope.listaDepartamentos = data;
    }

    $scope.LoadDepartamento = function () {
        searchRepository.getDepartamento($rootScope.empleado.idUsuario, $rootScope.empresa.idEmpresa, $rootScope.agencia.idSucursal)
            .success(getDepartamentoSuccessCallback)
            .error(errorCallBack);
    }

    $scope.SetDepartamento = function (dep) {
        $rootScope.departamento = dep;
        $rootScope.searchlevel = 5;
    };

    $scope.ClearDepartamento = function () {
        $rootScope.departamento = null;
    }

    //////////////////////////////////////////////////////////////////////////
    //Obtiene los proveedores
    $scope.ShowSearchProveedor = function () {
        $('#searchProveedor').modal('show');
    };

    $scope.BuscarProveedor = function () {
        searchRepository.getProveedor($scope.textProveedor)
            .success(getProveedorSuccessCallback)
            .error(errorCallBack);
    };

    var getProveedorSuccessCallback = function (data, status, headers, config) {
        $rootScope.listaProveedores = data;
        alertFactory.success('Se ha(n) encontrado ' + data.length + ' proveedor(es) que coniciden con la búsqueda.');
    };

    $scope.SetProveedor = function (pro) {
        $rootScope.proveedor = pro;
        $('#searchProveedor').modal('hide');
    };

    $scope.ClearProveedor = function () {
        $rootScope.proveedor = null;
    }

    //////////////////////////////////////////////////////////////////////////
    //DatePicker
    $scope.today = function () {
        $scope.dt1 = new Date();
        $scope.dt2 = new Date();
    };

    //$scope.today();

    $scope.clear = function () {
        $scope.dt1 = null;
        $scope.dt2 = null;
    };

    // Disable weekend selection
    $scope.disabled = function (date, mode) {
        return (mode === 'day' && (date.getDay() === -1 || date.getDay() === 7));
    };

    $scope.toggleMin = function () {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    //$scope.toggleMin();

    $scope.open1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened1 = true;
    };

    $scope.open2 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened2 = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.initDate = new Date();
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $rootScope.format = $scope.formats[0];

    //LQMA 20012016 add implementacion busqueda folios
    //BEGIN
    //$scope.getFolios = function() {        
    //}
    //LQMA 21012016 add funcionalidad para busqueda de folios
    var getFoliosSuccessCallback = function (data, status, headers, config) {

        if (data.length == 0) {
            alertFactory.warning('No se han encontrado registros con los parametros seleccionados.');
        } else {
            console.log(data);
            $rootScope.ordenesCompra = data;
            $('#searchResultsO').modal('show');
        }

        $('#btnBuscar').button('reset');

    };

    $scope.CargaOrden = function (fol) {

        $('#closeMenu').click();
        $('#searchResultsO').modal('hide');
        $rootScope.empresa = null; // ? 0 : $rootScope.empresa.idEmpresa);
        $rootScope.agencia = null; // ? 0 : $rootScope.agencia.idSucursal);
        $rootScope.departamento = null; // ? 0: $rootScope.departamento.idDepartamento);
        $scope.folioBusca = ''; // ? '': $scope.folioBusca);
        $rootScope.proveedor = null; //? 0: $rootScope.proveedor.idProveedor);
        $rootScope.tipo = null; // ? -1: $rootScope.tipo.idtipoorden);
        $rootScope.folio = fol.Folio_Operacion; //LMS 29062016 resolvia la busqueda URL encimaba
        $rootScope.fol_tipofolio = fol.tipofolio; //LQMA 30062016
        $rootScope.fol_Folio_Operacion = fol.Folio_Operacion; //LQMA 30062016
        $rootScope.fol_nodoactual = fol.nodoactual; //LQMA 30062016


        $rootScope.fol_depto = fol.depto; //LMS 07092016
        $rootScope.esServicio = 0;

        //Si es una orden de Servicio la navegacion es diferente
        if ($rootScope.fol_depto == 'SERVICIO' || $rootScope.fol_depto == 'Servicio' && $rootScope.fol_tipofolio == 1) {
            //alert('Es Servicio');
            $rootScope.esServicio = 1;
            $rootScope.navBusquedaServicio($rootScope.fol_tipofolio, $rootScope.fol_nodoactual, $rootScope.fol_Folio_Operacion);
        } else {
            //Si es una Factura de Servicio
            if ($rootScope.fol_depto == 'SERVICIO' || $rootScope.fol_depto == 'Servicio' && $rootScope.fol_tipofolio == 5) {
                //alert('Es una Factura de Servicio');
                $rootScope.esServicio = 1;
                $rootScope.CargaEmpleado($rootScope.fol_Folio_Operacion);
            } else {
                //Si es una orden de Refacciones y es Planta
                //alert('Validar si es Planta o No');
                searchRepository.getIsPlanta(fol.Folio_Operacion) //LQMA 30062016
                    .success(getIsPlantaSuccessCallback)
                    .error(errorCallBack);
            }
        }
    };


    //Funcion para la navegacion de Ordenes de Refacciones
    var getIsPlantaSuccessCallback = function (data, status, headers, config) { //LQMA 30062016
        if (data == 1) {
            //alert('Es Planta');
            if ($rootScope.fol_tipofolio == 3)
                $rootScope.CargaEmpleado($rootScope.fol_Folio_Operacion);
            else
                $rootScope.navBusqueda($rootScope.fol_tipofolio, $rootScope.fol_nodoactual, $rootScope.fol_Folio_Operacion);
        } else
            $rootScope.CargaEmpleado($rootScope.fol_Folio_Operacion);
    };

    //END

});
