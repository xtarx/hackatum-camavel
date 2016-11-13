(function() {
    'use strict';
    angular.module('camavelApp').controller('bookingRqstCtrl', bookingRqstCtrl);
    bookingRqstCtrl.$inject = ['$rootScope', '$scope', '$location', 'localStorage', 'AuthenticationService', 'ActivityService'];

    function bookingRqstCtrl($rootScope, $scope, $location, store, AuthenticationService, ActivityService) {
        init();

        function init() {
            console.warn("INIT HAVE BEEN CALLED")
        }

        function loadRequests() {
            ActivityService.GetAll().then(function(activites) {
                $scope.activites = activites;
            });
        }
    }
})();