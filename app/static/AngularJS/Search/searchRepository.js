var searchUrl = global_settings.urlCORS + '/api/searchapi/';

registrationModule.factory('searchRepository', function ($http) {
    return {
        get: function (id) {
            return $http.get(searchUrl + '1|' + id);
        },
        // add: function (obj) {
        //     return $http.post(notificacionUrl, obj);
        // },
        // delete: function (obj) {
        //     return $http.delete(notificacionUrl + obj.id);
        // },
        update: function (id) {
            return $http.post(searchUrl + '2|' + id);
        }
    };
});