(function() {
    'use strict';
    angular.module('camavelApp').controller('bookingCtrl', bookingCtrl);
    bookingCtrl.$inject = ['$rootScope', '$scope', '$location', '$routeParams', 'localStorage', 'AuthenticationService', 'ActivityService', 'BookingService'];

    function bookingCtrl($rootScope, $scope, $location, $routeParams, store, AuthenticationService, ActivityService, BookingService) {
        var vm = this;
        vm.GetBookingContribution = GetBookingContribution;
        vm.refrenceId = $routeParams.refrenceId
        vm.acceptRequest = acceptRequest
        vm.rejectRequest = rejectRequest
        init();

        function GetUserRequests() {
            BookingService.GetUserRequests().then(function(activites) {
                vm.activites_requests = activites;
            });
        }

        function GetReceivedRequests() {
            BookingService.GetReceivedRequests().then(function(activites) {
                vm.activity_received_requests = activites;
            });
        }

        function acceptRequest(id) {
            BookingService.acceptRequest({
                request_id: id
            }).then(function() {
                $location.path('/mybookings/')
            });
        }

        function rejectRequest(id) {
            BookingService.rejectRequest({
                request_id: id
            }).then(function() {
                $location.path('/mybookings/')
            });
        }

        function GetBookingContribution() {
            BookingService.GetBookingContribution($routeParams.refrenceId).then(function(activity) {
                vm.contribution = parseInt(activity.price, 10);
                vm.contribution_min = parseInt(activity.price, 10);
                vm.refrence = $routeParams.refrenceId;
            });
        }

        function init() {
            vm.activites_requests = null;
            vm.activity_received_requests = null;
            console.warn("INIT HAVE BEEN CALLED")
            GetUserRequests();
            GetReceivedRequests();
        }

        function showList(id) {
            $location.path('/list/' + id)
        }
    }
})();