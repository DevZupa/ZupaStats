'use strict';

/**
 * @ngdoc function
 * @name zepochRedisApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zepochRedisApp
 */
ERDBM
  .controller('KillsCtrl',["$scope","$rootScope","$location","$http", function ($scope,$rootScope,$location,$http) {
        $(".nav li").removeClass("active");
        $("#kills").addClass("active");
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        var MC = $scope;
        var RS = $rootScope;
        MC.loadingData = true;
        MC.currentPage = 1;
        MC.pageSize = 20;
        $http.post(RS.serverURL + '?date='+ new Date().getTime(),{"db" : RS.selectedServer.dbi }).
            success(function(data, status, headers, config) {
                RS.data = data;
                MC.unEpochorize(data);
                MC.loadingData = false;
            }).error(function(error){
            });
                MC.loadingData = false;
        MC.unEpochorize = unEpochorize;
        function unEpochorize(data){
            RS.players = [];
            RS.weapons = [];
            angular.forEach(data, function (value, key) {




            });
        }


        MC.changeLoc = changeLoc;



        function changeLoc(where){
            $location.path(where);
        }




  }]);
