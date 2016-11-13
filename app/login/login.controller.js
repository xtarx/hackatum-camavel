(function() {
    'use strict';
    angular.module('camavelApp').controller('LoginController', LoginController);
    LoginController.$inject = ['$rootScope', '$location', 'AuthenticationService', 'FlashService', 'ezfb', '$scope'];

    function LoginController($rootScope, $location, AuthenticationService, FlashService, ezfb, $scope) {
        var vm = this;
        vm.login = connectFb;
        $scope.logout = logout;
        $scope.loginfb = connectFb;
        var isLoggedIn = AuthenticationService.isLoggedIn();
        $scope.isLogged = isLoggedIn;

        function connectFb() {
            // alert("fblogin called")
            ezfb.getLoginStatus(function(response) {
                if (response.status === 'connected') {
                    var accessToken = response.authResponse.accessToken;
                    console.log("response token " + accessToken)
                    ezfb.api('/me?fields=id,email,first_name,last_name,picture.width(600).height(600)', function(response) {
                        AuthenticationService.Login(response.email, response.id, response.picture.data.url, response.first_name, response.last_name, handle_fb_response);
                    });
                } else {
                    ezfb.login(function(response) {
                        ezfb.api('/me?fields=id,email,first_name,last_name,picture.width(600).height(600)', function(response) {
                            AuthenticationService.Login(response.email, response.id, response.picture.data.url, response.first_name, response.last_name, handle_fb_response);
                        });
                    });
                }
            });
        };

        function logout() {
            AuthenticationService.ClearCredentials();
            location.reload();
            // $location.path('/');
            // $route.reload();
        }

        function handle_fb_response(response) {
            if (response.success) {
                // alert("success of handle_fb_response")
                AuthenticationService.SetCredentials(response.user_id, response.email, response.facebook_id, response.picture.data.url, response.first_name, response.last_name);
                // $location.path('/');
                location.reload();
            } else {
                console.log("fail" + JSON.stringify(response));
                FlashService.Error(response.message);
                console.log(response.message);
                vm.dataLoading = false;
            }
        }
    }
})();