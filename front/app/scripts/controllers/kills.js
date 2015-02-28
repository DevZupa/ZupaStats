'use strict';

/**
 * @ngdoc function
 * @name zepochRedisApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zepochRedisApp
 */
ZupaStats
  .controller('KillsCtrl',["$scope","$rootScope","$location","$http", function ($scope,$rootScope,$location,$http) {
        $(".nav li").removeClass("active");
        $("#kills").addClass("active");

        var MC = $scope;
        var RS = $rootScope;

        MC.currentPage = 1;
        MC.pageSize = 20;

        MC.changeLoc = changeLoc;
        MC.view = view;

        function view(string){

            changeLoc('/player/'+ string);
        }



        function changeLoc(where){
            $location.path(where);
        }




  }]);
