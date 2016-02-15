var facturaUrl = global_settings.urlCORS + '/api/facturaapi/';

registrationModule.factory('facturaRepository', function ($http) {
    return {        
                getDoc: function (folio,idperfil,idDoc) {
                    return $http.get(facturaUrl + '1|' + folio + '|' + idperfil + '|' + idDoc);
                },
                setFactura: function (folio,idperfil,opcion) {
                    return $http.post(facturaUrl + '1|' + folio + '|' + idperfil + '|' + opcion);
                }
            };
});