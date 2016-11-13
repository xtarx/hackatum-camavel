(function() {
    'use strict';
    angular.module('camavelApp').factory('BookingService', BookingService);
    BookingService.$inject = ['$http', 'myConstants'];

    function BookingService($http, myConstants) {
        var apiURL = myConstants.url + "requests/";
        var service = {};
        service.GetUserRequests = GetUserRequests;
        service.GetReceivedRequests = GetReceivedRequests;
        service.GetBookingContribution = GetBookingContribution;
        service.RequestToJoin = RequestToJoin;
        service.acceptRequest = acceptRequest;
        service.rejectRequest = rejectRequest;
        service.canRequest = canRequest;
        return service;

        function RequestToJoin(id) {
            return $http.post(apiURL + 'add/', id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function canRequest(id) {
            return $http.get(apiURL + 'can_request/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetBookingContribution(id) {
            return $http.get(apiURL + 'get_contribution/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function acceptRequest(data) {
            return $http.post(apiURL + 'accept/', data).then(handleSuccess, handleError('Error getting user by id'));
        }

        function rejectRequest(data) {
            return $http.post(apiURL + 'reject/', data).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetUserRequests(id) {
            return $http.get(apiURL + 'get_for_user/').then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetReceivedRequests(id) {
            return $http.get(apiURL + 'get_to_user/').then(handleSuccess, handleError('Error getting user by id'));
        }
        // private functions
        function handleSuccess(data) {
            console.log("handle success");
            return data.data;
        }

        function handleError(error) {
            return function() {
                return {
                    // false;
                    // success: false,
                    // message: error
                };
            };
        }
    }
})();