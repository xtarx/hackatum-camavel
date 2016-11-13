(function() {
    'use strict';
    angular.module('camavelApp', ['ngRoute', 'ngCookies', 'ezfb', 'angularModalService', 'vsGoogleAutocomplete', 'ngFileUpload', 'LocalStorageModule']).constant("myConstants", {
        // "url": "http://localhost/camavel/",
        "url": "api/",
        "port": "80"
    }).config(config).run(run);
    config.$inject = ['$routeProvider', '$locationProvider', 'ezfbProvider', 'localStorageServiceProvider'];

    function config($routeProvider, $locationProvider, ezfbProvider, localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('camavel');
        //httpost
        // $httpProvider.defaults.headers.common = {
        //     'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        // };
        // $httpProvider.defaults.headers.post = {
        //     'Content-Type': 'application/x-www-form-urlencoded'
        // };
        // $httpProvider.defaults.headers.put = {};
        // $httpProvider.defaults.headers.get = {};
        // $httpProvider.defaults.headers.patch = {};
        //httpost
        //ezfb
        ezfbProvider.setInitParams({
            appId: '120494661465630',
            version: 'v2.3'
        });
        //ezfb end
        $routeProvider.when('/', {
            controller: 'activityCtrl',
            templateUrl: 'app/activity/views/homepage.html',
            controllerAs: 'vm'
        }).when('/list/:listId?', {
            controller: 'activityCtrl',
            templateUrl: 'app/activity/views/activity_detail.html',
            controllerAs: 'vm'
        }).when('/listall/', {
            controller: 'activityCtrl',
            templateUrl: 'app/activity/views/activity_list.html',
            controllerAs: 'vm'
        }).when('/mybookings', {
            controller: 'bookingCtrl',
            templateUrl: 'app/booking/views/booking_mine.html',
            controllerAs: 'vm'
                // }).when('/confirm:refrenceId?', {
        }).when('/payment/:refrenceId', {
            controller: 'bookingCtrl',
            templateUrl: 'app/booking/views/booking_payment_form.html',
            controllerAs: 'vm'
        }).when('/confirmation/:refrenceId', {
            controller: 'bookingCtrl',
            templateUrl: 'app/booking/views/booking_confirmation.html',
            controllerAs: 'vm'
        }).when('/invoice/:refrenceId', {
            controller: 'bookingCtrl',
            templateUrl: 'app/booking/views/booking_invoice.html',
            controllerAs: 'vm'
        }).when('/activity/create', {
            controller: 'activityCtrl',
            templateUrl: 'app/activity/views/activity_create2.html',
            controllerAs: 'vm'
        }).
        when('/login', {
            controller: 'LoginController',
            templateUrl: 'app/login/login.view.html',
            controllerAs: 'vm'
        }).when('/logout', {
            controller: 'LogoutController',
            template: 'login/login.view.html',
            controllerAs: 'vm'
        }).when('/register', {
            controller: 'RegisterController',
            templateUrl: 'app/register/register.view.html',
            controllerAs: 'vm'
        }).when('/faq', {
            controller: 'FAQController',
            templateUrl: 'app/faq/faq.view.html',
            controllerAs: 'vm'
        }).otherwise({
            redirectTo: '/'
        });
        //        $locationProvider.html5Mode(true);
    }
    run.$inject = ['$rootScope', '$location', '$cookies', '$http', 'localStorageService'];

    function run($rootScope, $location, $cookies, $http, localStorageService) {
        // keep user logged in after page refresh
        //        console.log('in run fun');
        // $rootScope.globals = $cookies.get('globals') || {};
        $rootScope.globals = localStorageService.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
        $rootScope.$on('$locationChangeStart', function(event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            console.log('in run funaa');
            // alert("in change page")
            //            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var restrictedPage = false;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
    }
})();