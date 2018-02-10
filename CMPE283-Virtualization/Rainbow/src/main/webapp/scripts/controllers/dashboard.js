'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */

angular.module('yapp')
    .controller('MainCtrl',function ($scope,$rootScope,$location) {
        $scope.isloggedin=false;
        $scope.username=null;
        $scope.$on('userloggedin',function(event,data){
    $scope.isloggedin=$rootScope.globals.currentUser.isloggedin;
            $scope.username=$rootScope.globals.currentUser.username;
        });
        $scope.$on('userloggedout',function(event,data){
            $scope.isloggedin=false;
            $scope.username=null;});

})


  .controller('DashboardCtrl', function($scope,$uibModal, $state, $rootScope, $window, APIService,$location,toastr) {
    $scope.$state = $state;
      $scope.username=$rootScope.globals.currentUser.username;
      $scope.instanceBillDetail=[{"instanceName":null,"serverType":null,"flavorId":null,"createdTime":null,"bill":0}];
      $scope.totalBill=0;
      //$scope.instances=[{}];
      $scope.instanceDetail={};
      $scope.$on('serverListUpdated',function(event,data){
           $scope.getServerList();
          // $scope.apply();

      });

      $scope.openPopup1=function(){
          console.log('opening pop up');
          $rootScope.modalInstance=$uibModal.open({
              templateUrl:'views/dashboard/newinstance.html',
              controller:'DashboardCtrl'
          });
      }

      $scope.openPopup2=function(){
          console.log('opening pop up');
          $rootScope.modalInstance=$uibModal.open({
              templateUrl:'views/dashboard/newdbinstance.html',
              controller:'DashboardCtrl'
          });
      }

      $scope.openPopup3=function(){
          console.log('opening pop up');
          $rootScope.modalInstance=$uibModal.open({
              templateUrl:'views/dashboard/new3tierinstance.html',
              controller:'DashboardCtrl'
          });
      }

      $scope.cancel = function(){
          $rootScope.modalInstance.close();
      };

      $scope.launchnewInstance=function(instanceDetail){

          $scope.dataLoading = true;
          console.log(instanceDetail.networkIdList);
          console.log(instanceDetail.flavorId);
          console.log(instanceDetail.imageId);
          console.log(instanceDetail.instanceName);
          APIService.launchnewInstance(instanceDetail, function(response) {
              if(response.data) {
                  toastr.success("Instance launched successfully. Please click on refresh");
                  $scope.refreshInstanceList();
                  $rootScope.modalInstance.close();
                  // alert(response.data);

              } else {
                  $scope.error = response.message;
                  $scope.dataLoading = false;
                  alert("Instance not created");
              }
          });
      };

      $scope.launchnewdbInstance=function(dbinstanceDetail){
            var tdbInstanceDetail = {};
          tdbInstanceDetail.instanceName=dbinstanceDetail.instanceName+"_DB";
          tdbInstanceDetail.flavorId="MY-SMALL";
          tdbInstanceDetail.imageId="cirros";
          tdbInstanceDetail.serverType=dbinstanceDetail.serverType;
          tdbInstanceDetail.networkIdList=["CMPE-NET2"];

          $scope.dataLoading = true;

          APIService.launchnewInstance(tdbInstanceDetail, function(response) {
              if(response.data) {
                  toastr.success("Instance launched successfully. Please click on refresh");
                  $scope.refreshInstanceList();
                  $rootScope.modalInstance.close();
                  // alert(response.data);

              } else {
                  $scope.error = response.message;
                  $scope.dataLoading = false;
                  alert("Instance not created");
              }
          });
      };

      $scope.launchnew3tierInstance=function(instance3Detail){

          $scope.dataLoading = true;

          APIService.launchnew3tierInstance(instance3Detail, function(response) {
              if(response.data) {
                  toastr.success("Servers launched successfully. Please click on refresh");
                  $scope.refreshInstanceList();
                  $rootScope.modalInstance.close();
                  // alert(response.data);

              } else {
                  $scope.error = response.message;
                  $scope.dataLoading = false;
                  alert("Instance not created");
              }
          });
      };


    //   $scope.launchInstance = function (instance) {
    //     $scope.dataLoading = true;
    //     APIService.launchInstance(instance.name, instance.flavor, instance.image, function(response) {
    //         if(response.data) {
    //             $scope.refreshInstanceList();
    //         	alert(response.data + " " + response.data.status);
    //     } else {
    //         $scope.error = response.message;
    //         $scope.dataLoading = false;
    //         alert("Instance not created");
    //     }
    // });
    // };

      $scope.refreshInstanceList = function () {
          $scope.dataLoading = true;
          $location.path('/dashboard/overview1');
      };



      $scope.alocatefip = function (instance) {
          $scope.dataLoading = true;
          APIService.alocatefip(instance, function(response) {
              if(response.data) {
                  toastr.success("Floating IP Allocated successfully");
                  $scope.refreshInstanceList();
                  // alert(response.data);

              } else {
                  $scope.error = response.message;
                  $scope.dataLoading = false;
                  toastr.error("OOPS! Something went wrong, Please try after sometime");
                  // alert("Instance not paused");
              }
          });
      };



      $scope.stopInstance = function (instance) {
          $scope.dataLoading = true;
          APIService.stopInstance(instance, function(response) {
              if(response.data) {
                  toastr.success("Instance stopped successfully. Please click on refresh");
                  $scope.refreshInstanceList();
                  // alert(response.data);

              } else {
                  $scope.error = response.message;
                  $scope.dataLoading = false;
                  toastr.error("OOPS! Something went wrong, Please try after sometime");
                  // alert("Instance not paused");
              }
          });
      };
    


      $scope.deleteInstance = function (instance) {
          $scope.dataLoading = true;
          APIService.deleteInstance(instance, function(response) {
              if(response.data) {
                  toastr.success("Instance deleted successfully. Please click on refresh");
                  $scope.refreshInstanceList();
                  // alert(response.data);

              } else {
                  $scope.error = response.message;
                  $scope.dataLoading = false;
                  alert("Instance not deleted");
              }
          });
      };

      $scope.startInstance = function (instance,status) {
          $scope.dataLoading = true;
          var st=status;
          if(status=="PAUSED")
          {APIService.resumeInstance(instance, function(response) {
              if(response.data) {
                  toastr.success("Instance resumed successfully. Please click on refresh");
                  $scope.refreshInstanceList();
                  // alert(response.data);

              } else {
                  $scope.error = response.message;
                  $scope.dataLoading = false;
                  alert("Instance not resumed");
              }
          })}
          else if(status=="SHUTOFF") {
              APIService.startInstance(instance, function(response) {
                  // $scope.getServerList();
                  if(response.data) {
                      toastr.success("Instance started successfully. Please click on refresh");
                      $scope.refreshInstanceList();
                      // alert(response.data);

                  } else {
                      $scope.error = response.message;
                      $scope.dataLoading = false;
                      alert("Instance not started");
                  }
              })
          }};



      $scope.pauseInstance = function (instance) {
          $scope.dataLoading = true;
          APIService.pauseInstance(instance, function(response) {
              if(response.data) {
                  toastr.success("Instance paused successfully. Please click on refresh");
                  $scope.refreshInstanceList();
                  // alert(response.data);

              } else {
                  $scope.error = response.message;
                  $scope.dataLoading = false;
                  alert("Instance not paused");
              }
          });
      };

      $scope.getServerList = function () {
          APIService.getInstanceList(function(response) {
              if(response.data) {
                  $scope.instances = response.data;
              } else {
                  $scope.error = response.message;
                  $scope.dataLoading = false;
                  alert("Instance not found");
              }
          });
      };
    

    
	$scope.getInstance = function (instance) {
	    $scope.dataLoading = true;
	    APIService.getInstance(instance, function(response) {
	        if(response.data) {
	        	alert(response.data.instanceName + " " + response.data.status);
	           //alert(response.data)
	    } else {
	        $scope.error = response.message;
	        $scope.dataLoading = false;
	        alert("Instance not found");
	    }
	});
	};

    
    APIService.getFlavorList(function(response) {
        if(response.data) {
        	$scope.flavors = response.data;	
	    } else {
	        $scope.error = response.message;
	        $scope.dataLoading = false;
	        alert("Flavors not found");
	    }
    });
    
    APIService.getInstanceList(function(response) {
        if(response.data) {
        	$scope.instances = response.data;
            $rootScope.instanceList=$scope.instances;
            $scope.calculateBill($scope.instances);
	    } else {
	        $scope.error = response.message;
	        $scope.dataLoading = false;
	        alert("Instance not found");
	    }
    });
    
    APIService.getImageList(function(response) {
        if(response.data) {
        	$scope.images = response.data;	
	    } else {
	        $scope.error = response.message;
	        $scope.dataLoading = false;
	        alert("Image not found");
	    }
    });



    $scope.calculateBill = function(instances){
         $scope.instanceBillDetail=instances;
        var apachesml=0.001;
        var apachemed=0.002;
        var apachelrg=0.003;
        var apachewb=0.003;

        var nginxsml=0.002;
        var nginxmed=0.003;
        var nginxlrg=0.004;
        var nginxwb=0.004;

        var oraclesml=0.002;
        var oraclemed=0.003;
        var oraclelrg=0.004;
        var oraclewb=0.004;

        var mysqlsml=0.002;
        var mysqlmed=0.003;
        var mysqllrg=0.004;
        var mysqlwb=0.004;

        var mariasml=0.001;
        var mariamed=0.002;
        var marialrg=0.003;
        var mariawb=0.003;

        $scope.totalBill=0;
        var l=0
        angular.forEach(instances,function (instance) {
            console.log(instance.instanceName);
            $scope.instanceBillDetail[l].instanceName=instance.instanceName;
            $scope.instanceBillDetail[l].serverType=instance.serverType;
            $scope.instanceBillDetail[l].flavorId=instance.flavorId;
            $scope.instanceBillDetail[l].createdTime=instance.createdTime;
            if(instance.flavorId=="MY-SMALL"){
                if(instance.serverType=="APACHE"){
                    $scope.instanceBillDetail[l].bill=apachesml*instance.createdTime*60;
                }
                else if(instance.serverType=="NGINX"){
                    $scope.instanceBillDetail[l].bill=nginxsml*instance.createdTime*60;
                }
                else if(instance.serverType=="ORACLE"){
                    $scope.instanceBillDetail[l].bill=oraclesml*instance.createdTime*60;
                }
                else if(instance.serverType=="MYSQL"){
                    $scope.instanceBillDetail[l].bill=mysqlsml*instance.createdTime*60;
                }
                else if(instance.serverType=="MARIA"){
                    $scope.instanceBillDetail[l].bill=mariasml*instance.createdTime*60;
                }

            }
            else if(instance.flavorId=="MY-MEDIUM"){
                if(instance.serverType=="APACHE"){
                    $scope.instanceBillDetail[l].bill=apachemed*instance.createdTime*60;
                }
                else if(instance.serverType=="NGINX"){
                    $scope.instanceBillDetail[l].bill=nginxmed*instance.createdTime*60;
                }
                else if(instance.serverType=="ORACLE"){
                    $scope.instanceBillDetail[l].bill=oraclemed*instance.createdTime*60;
                }
                else if(instance.serverType=="MYSQL"){
                    $scope.instanceBillDetail[l].bill=mysqlmed*instance.createdTime*60;
                }
                else if(instance.serverType=="MARIA"){
                    $scope.instanceBillDetail[l].bill=mariamed*instance.createdTime*60;
                }

            }
             else if(instance.flavorId=="MY-LARGE"){
                if(instance.serverType=="APACHE"){
                    $scope.instanceBillDetail[l].bill=apachelrg*instance.createdTime*60;
                }
                else if(instance.serverType=="NGINX"){
                    $scope.instanceBillDetail[l].bill=nginxlrg*instance.createdTime*60;
                }
                else if(instance.serverType=="ORACLE"){
                    $scope.instanceBillDetail[l].bill=oraclelrg*instance.createdTime*60;
                }
                else if(instance.serverType=="MYSQL"){
                    $scope.instanceBillDetail[l].bill=mysqllrg*instance.createdTime*60;
                }
                else if(instance.serverType=="MARIA"){
                    $scope.instanceBillDetail[l].bill=marialrg*instance.createdTime*60;
                }

            }

            else if(instance.flavorId=="WEB-FLAVOUR"){
                if(instance.serverType=="APACHE"){
                    $scope.instanceBillDetail[l].bill=apachelrg*instance.createdTime*60;
                }
                else if(instance.serverType=="NGINX"){
                    $scope.instanceBillDetail[l].bill=nginxlrg*instance.createdTime*60;
                }
                else if(instance.serverType=="ORACLE"){
                    $scope.instanceBillDetail[l].bill=oraclelrg*instance.createdTime*60;
                }
                else if(instance.serverType=="MYSQL"){
                    $scope.instanceBillDetail[l].bill=mysqllrg*instance.createdTime*60;
                }
                else if(instance.serverType=="MARIA"){
                    $scope.instanceBillDetail[l].bill=marialrg*instance.createdTime*60;
                }

            }

            console.log ($scope.instanceBillDetail[l].bill);
            $scope.totalBill=$scope.totalBill+$scope.instanceBillDetail[l].bill;
            l++;
        });
        console.log ($scope.instanceBillDetail);

    };

      $scope.billReport = {};
      $scope.billReport.dataTable = new google.visualization.DataTable();
      $scope.billReport.dataTable.addColumn("string","Name")
      $scope.billReport.dataTable.addColumn("number","Qty")
      $scope.billReport.dataTable.addRow(["September",5]);
      $scope.billReport.dataTable.addRow(["October",4]);
      $scope.billReport.dataTable.addRow(["November",3.8]);
      $scope.billReport.dataTable.addRow(["December",$scope.totalBill]);
      $scope.billReport.title="Billing Report";
      console.log("......"+$scope.totalBill);



    
    $scope.menuItems = [];
    angular.forEach($state.get(), function (item) {
        if (item.data && item.data.visible) {
            $scope.menuItems.push({name: item.name, text: item.data.text});
        }
    });
  });

var googleChart = googleChart || angular.module("google-chart",[]);

googleChart.directive("googleChart",function(){
    return{
        restrict : "A",
        link: function($scope, $elem, $attr){
            var dt = $scope[$attr.ngModel].dataTable;

            var options = {
            		backgroundColor: 'transparent',
            		titleTextStyle: {
            			fontSize: 14,
            		}
            };
            if($scope[$attr.ngModel].title)
                options.title = $scope[$attr.ngModel].title;
                options.legend= "none";
                options.pieHole= "0.5";


            var googleChart = new google.visualization[$attr.googleChart]($elem[0]);
            googleChart.draw(dt,options)
        }
    }
});

angular.module('yapp')
.controller('ReportsCtrl', function($scope, $state,$rootScope,APIService) {
  $scope.$state = $state;
    $scope.instances= $rootScope.instanceList.length;
    console.log("list length "+$scope.instances);
    //Reports
    $scope.instanceReport = {};
    $scope.instanceReport.dataTable = new google.visualization.DataTable();
    $scope.instanceReport.dataTable.addColumn("string","Name")
    $scope.instanceReport.dataTable.addColumn("number","Qty")
    $scope.instanceReport.dataTable.addRow(["Instances Used",$scope.instances]);
    $scope.instanceReport.dataTable.addRow(["Instances Available",10]);
    $scope.instanceReport.title="Instances ("+$scope.instances+" of 10 Used)";

    $scope.vcpuReport = {};
    $scope.vcpuReport.dataTable = new google.visualization.DataTable();
    $scope.vcpuReport.dataTable.addColumn("string","Name")
    $scope.vcpuReport.dataTable.addColumn("number","Qty")
    $scope.vcpuReport.dataTable.addRow(["VCPU Used",$scope.instances]);
    $scope.vcpuReport.dataTable.addRow(["VCPU Available",20]);
    $scope.vcpuReport.title="VCPUs ("+$scope.instances+" of 20 Used)";

    $scope.ramReport = {};
    $scope.ramReport.dataTable = new google.visualization.DataTable();
    $scope.ramReport.dataTable.addColumn("string","Name")
    $scope.ramReport.dataTable.addColumn("number","Qty")
    $scope.ramReport.dataTable.addRow(["RAM Used",$scope.instances*0.5]);
    $scope.ramReport.dataTable.addRow(["RAM Available",50]);
    $scope.ramReport.title="RAM ("+$scope.instances*0.5+"GB of 50GB Used)";

    $scope.volReport = {};
    $scope.volReport.dataTable = new google.visualization.DataTable();
    $scope.volReport.dataTable.addColumn("string","Name")
    $scope.volReport.dataTable.addColumn("number","Qty")
    $scope.volReport.dataTable.addRow(["Volume Used",1]);
    $scope.volReport.dataTable.addRow(["Volume Available",1000]);
    $scope.volReport.title="Storage Volume (1GB of 1000GB Used)";

//     $scope.data1 = {};
//     $scope.data1.dataTable = new google.visualization.DataTable();
//     $scope.data1.dataTable.addColumn("string","Name")
//     $scope.data1.dataTable.addColumn("number","Qty")
//     $scope.data1.dataTable.addRow(["Active",1]);
//     $scope.data1.dataTable.addRow(["Inactive",0]);
//     //$scope.data1.dataTable.addRow(["Test3",3]);
//     $scope.data1.title="Status"
//
//   $scope.data1 = {};
//       $scope.data1.dataTable = new google.visualization.DataTable();
//       $scope.data1.dataTable.addColumn("string","Name")
//       $scope.data1.dataTable.addColumn("number","Qty")
//       $scope.data1.dataTable.addRow(["Active",1]);
//       $scope.data1.dataTable.addRow(["Inactive",0]);
//       //$scope.data1.dataTable.addRow(["Test3",3]);
//       $scope.data1.title="Status"
//
//  $scope.data2 = {};
//       $scope.data2.dataTable = new google.visualization.DataTable();
//       $scope.data2.dataTable.addColumn("string","Name")
//       $scope.data2.dataTable.addColumn("number","Qty")
//       $scope.data2.dataTable.addRow(["SQL",60]);
//       $scope.data2.dataTable.addRow(["Server",40]);
//       //$scope.data2.dataTable.addRow(["Test3",3]);
//       $scope.data2.title="SQL Database Server"
//
// $scope.data3 = {};
//       $scope.data3.dataTable = new google.visualization.DataTable();
//       $scope.data3.dataTable.addColumn("string","Name")
//       $scope.data3.dataTable.addColumn("number","Qty")
//       $scope.data3.dataTable.addRow(["Apache+SQL",55.50]);
//       $scope.data3.dataTable.addRow(["Server",44.50]);
//       //$scope.data3.dataTable.addRow(["Test3",3]);
//       $scope.data3.title="Apache+SQL Server"
//
// $scope.data4 = {};
//       $scope.data4.dataTable = new google.visualization.DataTable();
//       $scope.data4.dataTable.addColumn("string","Name")
//       $scope.data4.dataTable.addColumn("number","Qty")
//       $scope.data4.dataTable.addRow(["Apache",43]);
//       $scope.data4.dataTable.addRow(["Server",57]);
//       //$scope.data4.dataTable.addRow(["Test3",3]);
//       $scope.data4.title="Apache Server"
//
// $scope.data5 = {};
//       $scope.data5.dataTable = new google.visualization.DataTable();
//       $scope.data5.dataTable.addColumn("string","Name")
//       $scope.data5.dataTable.addColumn("number","Qty")
//       $scope.data5.dataTable.addRow(["Instance 1",1.5]);
//       $scope.data5.dataTable.addRow(["Instance 2",4]);
//       $scope.data5.dataTable.addRow(["Instance 3",2.3]);
//       $scope.data5.title="Instances"
});

