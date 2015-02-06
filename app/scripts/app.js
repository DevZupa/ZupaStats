'use strict';
/**
 * @ngdoc overview
 * @name zepochRedisApp
 * @description
 * # zepochRedisApp
 *
 * Main module of the application.
 */
var ERDBM = angular
  .module('ZupaStats', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'angularLocalStorage',
    'NgSwitchery',
    'ui.bootstrap',
    'angularUtils.directives.dirPagination',
        'toaster',
        'tc.chartjs'
  ]);
ERDBM.config(["$routeProvider",function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
       .when('/servers', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        })
        .when('/kills', {
            templateUrl: 'views/kills.html',
            controller: 'KillsCtrl'
        })
        .when('/players', {
            templateUrl: 'views/kills.html',
            controller: 'PlayersCtrl'
        })
        .when('/weapons', {
            templateUrl: 'views/weapons.html',
            controller: 'WeaponsCtrl'
        })
        .when('/player/:puid', {
            templateUrl: 'views/player.html',
            controller: 'PlayerCtrl'
        })
      .otherwise({
        redirectTo: '/'
      });
  }]);

ERDBM.run(["$rootScope","storage","$location","$http","Data",
    function($rootScope,storage,$location,$http,Data) {
        var globalScope = $rootScope;
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        globalScope.players = [];
        globalScope.weapons = [];
        globalScope.data = [];
        globalScope.serverURL = "http://37.187.135.190/uk431/ZRDBM2/server/getNoLogDeathLogs.php";
        globalScope.servers = [
            {name: "Chernarus 1", dbi: "1", map:"chernarus",descr: "Chernarus Epoch Overpoch: Scripted by Zupa. "},
            {name: "Panthera 3", dbi: "5",map:"panthera",descr: "Panthera Epoch Overpoch: Scripted by Zupa. "}
        ];
        globalScope.angular = "Zupa";
        globalScope.version = "0.1";
        globalScope.selectedServer =  globalScope.servers[0];
        globalScope.getRandomColor = getRandomColor;
        globalScope.getData = getData;
        function getRandomColor() {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }
        function getData(){
            globalScope.loadingData = true;
        $http.post(globalScope.serverURL + '?date='+ new Date().getTime(),{"db" : globalScope.selectedServer.dbi }).
            success(function(data, status, headers, config) {
                globalScope.data = data;
                unEpochorize(data);

            }).error(function(error){
                globalScope.loadingData = false;
            });
        }
        globalScope.unEpochorize = unEpochorize;

        function unEpochorize(data){
            globalScope.players = [];
            globalScope.weapons = [];
            angular.forEach(data, function (value, key) {
                if(value.killerpuid != undefined && value.killerpuid != ""){
                    if(globalScope.players[value.killerpuid] == undefined){
                        globalScope.players[value.killerpuid] = {};
                        globalScope.players[value.killerpuid].names = [];
                        globalScope.players[value.killerpuid].killsData = [];
                        globalScope.players[value.killerpuid].killedData = [];
                        globalScope.players[value.killerpuid].bots = 0;
                        globalScope.players[value.killerpuid].weapons = [];
                    }
                    if($.inArray(value.name, globalScope.players[value.killerpuid].names) == -1){
                        globalScope.players[value.killerpuid].names.push(value.name);
                    }
                    globalScope.players[value.killerpuid].killsData.push(value);
                }
                if(value.killedpuid != undefined && value.killedpuid != ""){
                    if(globalScope.players[value.killedpuid] == undefined){
                        globalScope.players[value.killedpuid] = {};
                        globalScope.players[value.killedpuid].names = [];
                        globalScope.players[value.killedpuid].killsData = [];
                        globalScope.players[value.killedpuid].killedData = [];
                        globalScope.players[value.killedpuid].bots = 0;
                        globalScope.players[value.killedpuid].weapons = [];
                    }
                    if($.inArray(value.name, globalScope.players[value.killedpuid].names) == -1){
                        globalScope.players[value.killedpuid].names.push(value.name);
                    }
                    globalScope.players[value.killedpuid].killedData.push(value);
                }else{
                    globalScope.players[value.killerpuid].bots++;
                }
                if(value.weapon != undefined && value.weapon != ""){
                    if(globalScope.weapons[value.weapon] == undefined){
                        globalScope.weapons[value.weapon] = {};
                        globalScope.weapons[value.weapon].name = value.weapon;
                        globalScope.weapons[value.weapon].count = 0;
                    }
                    globalScope.weapons[value.weapon].count++;



                    if(value.killerpuid != undefined && value.killerpuid !=""){
                        if(globalScope.players[value.killerpuid].weapons[value.weapon] == undefined){
                            globalScope.players[value.killerpuid].weapons[value.weapon] = {};
                            globalScope.players[value.killerpuid].weapons[value.weapon].name = value.weapon;
                            globalScope.players[value.killerpuid].weapons[value.weapon].count = 0;
                        }
                        globalScope.players[value.killerpuid].weapons[value.weapon].count++;
                    }
                }
            });

            globalScope.weapons2 = [];
            angular.forEach(globalScope.weapons, function (value, key) {
                globalScope.weapons2.push(value);
            });


            alert(JSON.stringify(globalScope.players));
            globalScope.loadingData = false;

        }
    }]);

ERDBM.factory("Data", ['$http', 'toaster',
    function ($http, toaster) { // This service connects to our REST API

        var serviceBase = 'server/';

        var obj = {};
        obj.toast = function (data) {
            toaster.pop(data.status, "", data.message, 10000, 'trustedHtml');
        }
        obj.get = function (q) {
            return $http.get(serviceBase + q).then(function (results) {
                return results.data;
            },function(results){
                return {};
            });
        };
        obj.post = function (q, object) {
            return $http.post(serviceBase + q, object).then(function (results) {
                return results.data;
            },function(results){
                return {};
            });
        };
        obj.put = function (q, object) {
            return $http.put(serviceBase + q, object).then(function (results) {
                return results.data;
            },function(results){
                return {};
            });
        };
        obj.delete = function (q) {
            return $http.delete(serviceBase + q).then(function (results) {
                return results.data;
            },function(results){
                return {};
            });
        };

        return obj;
    }]);

ERDBM.directive('focus', function() {
    return function(scope, element) {
        element[0].focus();
    }
});

ERDBM.directive('passwordMatch', [function () {
    return {
        restrict: 'A',
        scope:true,
        require: 'ngModel',
        link: function (scope, elem , attrs,control) {
            var checker = function () {
                var e1 = scope.$eval(attrs.ngModel);
                var e2 = scope.$eval(attrs.passwordMatch);
                if(e2!=null)
                    return e1 == e2;
            };
            scope.$watch(checker, function (n) {
                control.$setValidity("passwordNoMatch", n);
            });
        }
    };
}]);