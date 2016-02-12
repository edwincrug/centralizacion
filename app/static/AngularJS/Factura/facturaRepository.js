var nodoUrl = global_settings.urlCORS + '/api/facturaapi/';

registrationModule.factory('facturaRepository', function ($http) {
    return {        
                getDoc: function (folio,idperfil,idDoc) {
                    return $http.get(nodoUrl + '1|' + folio + '|' + idperfil + '|' + idDoc);
                },
                setFactura: function (folio,idperfil,opcion) {
                    return $http.post(nodoUrl + '1|' + folio + '|' + idperfil + '|' + opcion);
                }
            };
});