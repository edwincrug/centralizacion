registrationModule.controller("searchController", function ($scope, $rootScope, localStorageService, alertFactory, searchRepository) {

    //Propiedades
     //$rootScope.hasExp = true;

    //Grupo de funciones de inicio
    $scope.init = function () {
        //$rootScope.hasExp = true;
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
    $scope.SetDivision = function(div) {
        $rootScope.division = div; 
    };

    $scope.ClearDivision = function() {
        $rootScope.division = ''; 
    }

    //////////////////////////////////////////////////////////////////////////
    //Departamento
    //////////////////////////////////////////////////////////////////////////
    $scope.SetDepartamento = function(div) {
        $rootScope.departamento = div; 
    };

    $scope.ClearDepartamento = function() {
        $rootScope.departamento = ''; 
    }

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