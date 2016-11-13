(function() {
    'use strict';
    angular.module('camavelApp').factory('ActivityService', ActivityService);
    ActivityService.$inject = ['$http', 'myConstants'];

    function ActivityService($http, myConstants) {
        var apiURL = myConstants.url + "activites/";
        var service = {};
        service.GetAll = GetAll;
        service.Get = Get;
        service.Create = Create;
        service.GetTypes = GetTypes;
        return service;

        function Create(activity) {
            return $http.post(apiURL + 'add', activity).then(handleSuccess, handleError('Error creating user'));
        }

        function GetAll() {
            return $http.get(apiURL + 'get_all').then(handleSuccess, handleError('Error getting user by id'));
        }

        function Get(id) {
            return $http.get(apiURL + 'get/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetTypes() {
            return $http.get(apiURL + 'get_types').then(handleSuccess, handleError('Error getting user by id'));
        }
        // private functions
        function handleSuccess(data) {
            console.log("handle success");
            return data.data;
        }

        function handleError(error) {
            return function() {
                return {
                    success: false,
                    message: error
                };
            };
        }
    }
})();