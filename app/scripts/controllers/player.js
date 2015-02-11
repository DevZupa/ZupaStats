'use strict';

/**
 * @ngdoc function
 * @name zepochRedisApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zepochRedisApp
 */
ZupaStats
  .controller('PlayerCtrl',["$scope","$rootScope","$location","$routeParams", function ($scope,$rootScope,$location,$routeParams) {
        $(".nav li").removeClass("active");
        $("#players").addClass("active");

        var MC = $scope;
        var RS = $rootScope;

        MC.changeLoc = changeLoc;

        MC.currentPage = 1;
        MC.pageSize = 20;

        function changeLoc(where){
            $location.path(where);
        }


        MC.puid =  $routeParams.param;

        MC.thePlayer = {};

        MC.pkills = [];
        MC.pDeaths = [];

        MC.pWeapons = [];

        RS.$watch('players4', function() {
            refreshStats();
        });

            function refreshStats(){

                    if( MC.puid != undefined &&  MC.puid != "" ){

                        angular.forEach(RS.players4, function (value, key) {

                            if(value.puid == MC.puid){
                             MC.thePlayer = value;
                            }
                        });

                         MC.pkills = MC.thePlayer.killsData;
                         MC.pDeaths = MC.thePlayer.killedData;
                        MC.pWeapons = [];
                        angular.forEach(MC.thePlayer.weapons, function (value, key) {
                            MC.pWeapons.push(value);
                        });

                        MC.pWeapons.sort(compareWeaponKills);

                    }
                    else{
                        MC.thePlayer.name = "Error player";
                    }
            }


        function compareWeaponKills(a,b) {
            if (a.count < b.count)
                return 1;
            if (a.count > b.count)
                return -1;
            return 0;
        }

        refreshStats();

  }]);
