'use strict';

/**
 * @ngdoc function
 * @name zepochRedisApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zepochRedisApp
 */
ERDBM
  .controller('PlayersCtrl',["$scope","$rootScope","$location","$http", function ($scope,$rootScope,$location,$http) {
        $(".nav li").removeClass("active");
        $("#players").addClass("active");

        var MC = $scope;
        var RS = $rootScope;

        MC.changeLoc = changeLoc;

        MC.selectServer = selectServer;

        MC.currentPage = 1;
        MC.pageSize = 20;

        function selectServer(index){
            RS.selectedServer =  RS.servers[index];
            changeLoc("/kills");
        }

        function changeLoc(where){
            $location.path(where);
        }

        MC.view = view;

        function view(string){

            changeLoc('/player/'+ string);
        }



  }]);
