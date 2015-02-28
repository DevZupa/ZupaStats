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

        MC.settings = [];

        MC.getSettings = getSettings;

        MC.password = "";

        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

        function getSettings(){
            $http.post(globalScope.serverURL + '/public/index.php/settings',{"password" : MC.password }).
                success(function(data, status, headers, config) {
                    MC.settings = data;
                }).error(function(error){
                    alert("No server connection or wrong password.");
                });
        }





  }]);
