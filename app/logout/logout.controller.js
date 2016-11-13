(function () {
    'use strict';

    angular
        .module('camavelApp')
        .controller('LogoutController', LogoutController);

    LogoutController.$inject = ['$location', 'AuthenticationService', 'FlashService'];

    function LogoutController($location, AuthenticationService, FlashService) {
        var vm = this;
        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
            $location.path('/');
        })();

    }

})();
