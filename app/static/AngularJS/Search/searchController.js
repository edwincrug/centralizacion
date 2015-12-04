registrationModule.controller("searchController", function ($scope, $rootScope, localStorageService, alertFactory, searchRepository) {

    //Propiedades
    $rootScope.searchlevel = 1;

    //Desconfiguramos el clic izquierdo en el frame contenedor de documento
    var errorCallBack = function (data, status, headers, config) {
        $('#btnEnviar').button('reset');
        alertFactory.error('Ocurrio un problema');
    };

    //Grupo de funciones de inicio
    $scope.init = function () {
        //$rootScope.hasExp = true;
        $scope.loadDivision();
    };

    $scope.Search = function() {
    	$("#finder").animate({
            width: "show"
        });
    };

    $scope.ShowSearchSucursal = function() {
        $('#searchSucursal').modal('show');

    };
    $scope.ShowSearchProveedor = function() {
        $('#searchProveedor').modal('show');

    };
    $scope.ShowSearchSolicitante = function() {
        $('#searchSolicitante').modal('show');

    };
    
    $scope.CloseGrid = function() {
    	$("#finder").animate({
            width: "hide"
        });
        //$rootScope.hasExp = true;
    };

    $scope.HideView = function() {
        //$rootScope.hasExp = false;
    };

    //////////////////////////////////////////////////////////////////////////
    //Establece la división
    //////////////////////////////////////////////////////////////////////////
    var getDivisionSuccessCallback = function (data, status, headers, config) {
        $rootScope.listaDivisiones = data;
    }

    $scope.loadDivision = function() {
        searchRepository.getDivision()
            .success(getDivisionSuccessCallback)
            .error(errorCallBack);
    }

    $scope.SetDivision = function(div) {
        $rootScope.division = div; 
        $rootScope.searchlevel = 2;
        $scope.LoadEmpresa($rootScope.empleado.idEmpleado);

    };

    $scope.ClearDivision = function() {
        $rootScope.division = null; 
    }

    //////////////////////////////////////////////////////////////////////////
    //Establece la empresa
    //////////////////////////////////////////////////////////////////////////
    var getEmpresaSuccessCallback = function (data, status, headers, config) {
        $rootScope.listaEmpresas = data;
    }

    $scope.LoadEmpresa = function(idempleado) {
        searchRepository.getEmpresa(idempleado)
            .success(getEmpresaSuccessCallback)
            .error(errorCallBack);
    }

    $scope.SetEmpresa = function(emp) {
        $rootScope.empresa = emp; 
    };

    $scope.ClearEmpresa = function() {
        $rootScope.empresa = null; 
    }

    //////////////////////////////////////////////////////////////////////////
    //Departamento
    //////////////////////////////////////////////////////////////////////////
    $scope.SetDepartamento = function(div) {
        $rootScope.departamento = div; 
    };

    $scope.ClearDepartamento = function() {
        $rootScope.departamento = null; 
    }

    //////////////////////////////////////////////////////////////////////////
    //Limpia la selección de acuerdo al nivel de búsqueda


    //////////////////////////////////////////////////////////////////////////
    //DatePicker
    $scope.today = function () {
        $scope.dt1 = new Date();
        $scope.dt2 = new Date();
    };

    $scope.today();

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
    $scope.toggleMin();

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

});