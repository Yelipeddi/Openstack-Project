'use strict';

angular.module('yapp').factory('APIService',
		['$http','$rootScope','$timeout',function($http, $rootScope, $timeout,toastr) {
					var service = {};
					$rootScope.instanceList=[{}];


					service.getFlavorList = function(callback) {
						$http({
							method : 'GET',
							url : 'getflavorList.htm'
						}).then(function(response) {
							// success callback
							callback(response);
						}, function(response) {
							alert(response);
						});
					};

					service.getInstanceList = function(callback) {
						$http({
							method : 'GET',
                            url : 'getServerListSDK.htm'
							//url : 'getInstances.htm'
						}).then(function(response) {
							// success callback
                            $rootScope.instanceList=response;
							callback(response);
						}, function(response) {
							alert(response);
						});
					};

					service.getImageList = function(callback) {
						$http({
							method : 'GET',
							url : 'getImageList.htm'
						}).then(function(response) {
							// success callback
							callback(response);
						}, function(response) {
							alert(response);
						});
					};


					// service.launchInstance = function(instanceName,flavor,image, callback) {
					// 	var instanceDetails = {
					// 			instanceName : instanceName,
					// 			flavor : flavor,
					// 			image : image,
					// 			status : "building"
					// 	};
                    //
					// 	$http({
					// 		method : 'POST',
					// 		url : 'launchInstance.htm',
					// 		data : instanceDetails
					// 	}).then(function(response) {
					// 		// success callback
					// 		callback(response);
					// 	}, function(response) {
					// 		// failure callback
					// 		alert(response);
					// 	});
					// };

					service.stopInstance = function(instanceName, callback) {

						$http({
							method : 'POST',
							url : 'stopInstance.htm',
							data : instanceName
						}).then(function(response) {
                            $rootScope.$broadcast('serverListUpdated','update data everywhere');
							// success callback
							callback(response);
						}, function(response) {
							// failure callback
							alert(response);
						});
					};

					service.deleteInstance = function(instanceName, callback) {

						$http({
							method : 'POST',
                            url : 'deleteInstanceSDK.htm',
							//url : 'deleteInstance.htm',
							data : instanceName
						}).then(function(response) {
                            $rootScope.$broadcast('serverListUpdated','update data everywhere');
							// success callback
							callback(response);
						}, function(response) {
							// failure callback
							alert(response);
						});
					};

            service.startInstance = function(instanceName, callback) {

                $http({
                    method : 'POST',
                    url : 'startInstance.htm',
                    //url : 'deleteInstance.htm',
                    data : instanceName
                }).then(function(response) {
                    $rootScope.$broadcast('serverListUpdated','update data everywhere');
                    // success callback
                    callback(response);
                }, function(response) {
                    // failure callback
                    alert(response);
                });
            };

            service.alocatefip = function(instanceName, callback) {

                $http({
                    method : 'POST',
                    url : 'allocatefipSDK.htm',
                    //url : 'deleteInstance.htm',
                    data : instanceName
                }).then(function(response) {
                    $rootScope.$broadcast('serverListUpdated','update data everywhere');
                    // success callback
                    callback(response);
                }, function(response) {
                    // failure callback
                    alert(response);
                });
            };



            service.pauseInstance = function(instanceName, callback) {

                $http({
                    method : 'POST',
                    url : 'pauseInstance.htm',
                    //url : 'deleteInstance.htm',
                    data : instanceName
                }).then(function(response) {
                    $rootScope.$broadcast('serverListUpdated','update data everywhere');
                    // success callback
                    callback(response);
                }, function(response) {
                    // failure callback
                    alert(response);
                });
            };

					service.resumeInstance = function(instanceName, callback) {

						$http({
							method : 'POST',
							url : 'resumeInstance.htm',
							data : instanceName
						}).then(function(response) {
                            $rootScope.$broadcast('serverListUpdated','update data everywhere');
							// success callback
							callback(response);
						}, function(response) {
							// failure callback
							alert(response);
						});
					};


            // service.getInstanceList = function(callback) {
            //     $http({
            //         method : 'GET',
            //         url : 'getServerListSDK.htm'
            //         //url : 'getInstances.htm'
            //     }).then(function(response) {
            //         // success callback
            //         callback(response);
            //     }, function(response) {
            //         alert(response);
            //     });
            // };


            service.launchnewInstance = function(instanceDetail, callback) {

                $http({
                    method : 'POST',
                    url : 'launchInstanceSDK.htm',
                    data : instanceDetail
                }).then(function(response) {
                    // success callback
                    callback(response);
                }, function(response) {
                    alert(response);
                });
            };

            service.launchnew3tierInstance = function(instanceDetail, callback) {

            	var paramdata={}
                $http({
                    method : 'POST',
                    url : 'launch3tierAppSDK.htm',
					// instanceName:instanceDetail,
                    // webserver:webserverType,
					// dbserver:dbserverType
                    data : instanceDetail
                }).then(function(response) {
                    // success callback
                    callback(response);
                }, function(response) {
                    alert(response);
                });
            };



					// service.getInstance = function(instance, callback) {
                    //
					// 	$http({
					// 		method : 'POST',
					// 		url : 'getInstance.htm',
					// 		data : instance
					// 	}).then(function(response) {
					// 		// success callback
					// 		callback(response);
					// 	}, function(response) {
					// 		alert(response);
					// 	});
					// };


					return service;
				} ]);