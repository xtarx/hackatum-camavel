(function() {
    'use strict';
    angular.module('camavelApp').controller('activityCtrl', activityCtrl);
    activityCtrl.$inject = ['$rootScope', '$scope', '$location', 'localStorage', 'AuthenticationService', 'ActivityService', 'Upload', '$timeout', '$routeParams', 'BookingService', 'myConstants'];

    function activityCtrl($rootScope, $scope, $location, store, AuthenticationService, ActivityService, Upload, $timeout, $routeParams, BookingService, myConstants) {
        var vm = this;
        var api_upload_URL = myConstants.url + "activites/do_upload";
        vm.create = create;
        vm.getDetails = getDetails;
        vm.RequestToJoin = RequestToJoin;
        vm.nextStep = nextStep;
        vm.golistAll = golistAll;
        vm.current_step = 1;
        var isLoggedIn = AuthenticationService.isLoggedIn();
        vm.searchTerm = '';
        vm.filters = {};
        vm.selectedType = 0;
        vm.uploaded_files = [];
        init();
        //img upload
        $scope.$watch('files', function() {
            $scope.upload($scope.files);
        });
        $scope.$watch('file', function() {
            if ($scope.file != null) {
                $scope.files = [$scope.file];
            }
        });
        $scope.upload = function(files) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    if (!file.$error) {
                        Upload.upload({
                            url: api_upload_URL,
                            data: {
                                // user_id: 12,
                                userfile: file
                            }
                        }).then(function(resp) {
                            $timeout(function() {
                                // $scope.log = 'file: ' + resp.config.data.file.name + ', Response: ' + JSON.stringify(resp.data) + '\n' + $scope.log;
                                vm.uploaded_files.push(resp.data);
                                console.log(resp.data)
                                console.log(vm.uploaded_files)
                                    // alert(vm.uploaded_files);
                            });
                        }, null, function(evt) {
                            // var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            // $scope.log = 'progress: ' + progressPercentage + '% ' + evt.config.data.file.name + '\n' + $scope.log;
                        });
                    }
                }
            }
        };
        //img upload
        function loadAll() {
            ActivityService.GetAll().then(function(activities) {
                vm.activities = activities;
            });
        }

        function loadTypes() {
            ActivityService.GetTypes().then(function(types) {
                vm.activity_types = types;
            });
        }

        function init() {
            console.warn("INIT HAVE BEEN CALLED")
            loadAll();
            loadTypes();
        }

        function golistAll() {
            $location.path('/listall/')
        }

        function addActivity(data) {
            ActivityService.Create(data).then(function(response) {
                if (response.success) {
                    $location.path('/list/' + response.id)
                    console.log('Task added successful');
                    // alert('Task added successful');
                } else {
                    console.log('Task failed to add');
                    // alert('Task failed to add');
                }
            });
        }

        function nextStep() {
            // alert(vm.current_step);
            if (vm.current_step == 3) {
                //submit form
                addActivity({
                    title: vm.activity_title,
                    type: vm.activity_type,
                    destination: vm.destination,
                    description: vm.description,
                    price: vm.price,
                    vacancies: vm.vacancies,
                    duration: vm.duration,
                    agenda: vm.check_list,
                    start_date: vm.activity_start_date,
                    end_date: vm.activity_end_date,
                    uploaded_files: vm.uploaded_files
                });
                //redirect to created activity
                // alert('redir')
                // $location.path('/list/4')
            } else {
                vm.current_step++;
            }
        }

        function create() {
            console.warn("ACTIVITY.CREATE")
            loadTypes();
            // console.log
            //step1
            vm.activity_title = "";
            vm.activity_time = "12:00 AM";
            vm.activity_type = "";
            vm.activity_start_date = "Nov 14, Wed";
            vm.activity_end_date = "Nov 17, Thu";
            vm.destination = "";
            //step 2
            vm.description = "";
            vm.check_list = "";
            vm.duration = "";
            //step 3
            vm.vacancies = "10";
            vm.price = "2";
        }

        function getDetails() {
            vm.can_request = false;
            vm.can_request = canRequest();
            ActivityService.Get($routeParams.listId).then(function(selected_activity) {
                $scope.selected_activity = selected_activity;
            });
        }

        function canRequest() {
            vm.can_request = false;
            BookingService.canRequest($routeParams.listId).then(function(res) {
                vm.can_request = res.can;
            });
        }

        function RequestToJoin() {
            BookingService.RequestToJoin({
                activity_id: $routeParams.listId,
                receiver_id: $scope.selected_activity.creator_id
            }).then(function(resp) {
                console.log("donendos" + resp)
                    // alert("a7a")
                $location.path('/mybookings');
            });
        }

        function showList(id) {
            $location.path('/list/' + id)
        }
    }
})();