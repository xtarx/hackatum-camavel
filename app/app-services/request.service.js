(function() {
    'use strict';
    angular.module('camavelApp').factory('RequestService', RequestService);
    RequestService.$inject = ['$http', 'myConstants'];

    function RequestService($http, myConstants) {
        var apiURL = myConstants.url + "requests/";
        var service = {};
        service.GetMyRequests = GetMyRequests;
        service.GetTripRequests = GetTripRequests;
        service.Join = Join;
        service.Accept = Accept;
        service.Reject = Reject;
        return service;

        function GetMyRequests(id) {
            return $http.get('api/todos/').then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetTripRequests(id) {
            return $http.get('api/todos/').then(handleSuccess, handleError('Error getting user by id'));
        }

        function Join(user) {
            return $http.post(apiURL + '/add', user).then(handleSuccess, handleError('Error creating user'));
        }

        function Accept(id) {
            return $http.post(apiURL + 'accept', user).then(handleSuccess, handleError('Error creating user'));
        }

        function Reject(id) {
            return $http.post(apiURL + 'reject', user).then(handleSuccess, handleError('Error creating user'));
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