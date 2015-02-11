'use strict';

/**
 * @ngdoc function
 * @name zepochRedisApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zepochRedisApp
 */
ZupaStats
  .controller('WeaponsCtrl',["$scope","$rootScope","$location","$http", function ($scope,$rootScope,$location,$http) {
        $(".nav li").removeClass("active");
        $("#weapons").addClass("active");

        var MC = $scope;
        var RS = $rootScope;

        MC.changeLoc = changeLoc;

        MC.currentPage = 1;
        MC.pageSize = 20;

        MC.selectServer = selectServer;

        function selectServer(index){
            RS.selectedServer =  RS.servers[index];
            changeLoc("/kills");
        }

        function changeLoc(where){
            $location.path(where);
        }




  }]);
