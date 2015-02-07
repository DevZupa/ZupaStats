'use strict';

/**
 * @ngdoc function
 * @name zepochRedisApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zepochRedisApp
 */
ERDBM
  .controller('MainCtrl',["$scope","$rootScope","$location","$http", function ($scope,$rootScope,$location,$http) {
        $(".nav li").removeClass("active");
        $("#servers").addClass("active");

        var MC = $scope;
        var RS = $rootScope;

        MC.changeLoc = changeLoc;

        MC.selectServer = selectServer;

        function selectServer(index){
            RS.selectedServer =  RS.servers[index];
            RS.getData();
            changeLoc("/stats");
        }

        function changeLoc(where){
            $location.path(where);
        }




  }]);
