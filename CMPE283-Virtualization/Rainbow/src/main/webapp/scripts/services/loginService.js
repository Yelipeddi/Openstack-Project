'use strict';

angular.module('yapp').factory('AuthenticationService',
		['$http','$rootScope','$timeout',function($http, $rootScope, $timeout) {
					var service = {};

					service.Login = function(server, username, password, callback) {
						var connection = {
							server : server,
							username : username,
							password : password
							//port : "5000"
						};
						$http({
							method : 'POST',
							url : 'login.htm',
							data : connection
						}).then(function(response) {
							// success callback
							callback(response);
						}, function(response) {
							// failure callback
						});
					};

					service.SetCredentials = function(server, username,password) {
						$rootScope.globals = {
							currentUser : {
								isloggedin:true,
								username : username,
								server : server,
								password: password
							}
						};
                        $rootScope.$broadcast('userloggedin','update data everywhere');
					};

					service.ClearCredentials = function() {
						$rootScope.globals = {};
                        $rootScope.$broadcast('userloggedout','update data everywhere');

					};

					return service;
				} ]);