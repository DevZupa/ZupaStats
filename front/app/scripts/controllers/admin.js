'use strict';

/**
 * @ngdoc function
 * @name zepochRedisApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zepochRedisApp
 */
ZupaStats
  .controller('AdminCtrl',["$scope","$rootScope","$location","$http", function ($scope,$rootScope,$location,$http) {
        $(".nav li").removeClass("active");
        $("#admin").addClass("active");

        var MC = $scope;
        var RS = $rootScope;

        MC.changeLoc = changeLoc;

        MC.selectServer = selectServer;





  }]);
