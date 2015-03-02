'use strict';

/**
 * @ngdoc overview
 * @name zupastatsApp
 * @description
 * # zupastatsApp
 *
 * Main module of the application.
 */
var ZupaStats = angular
  .module('zupastatsApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'angularUtils.directives.dirPagination',
    'chart.js'
  ])
  .config(['$routeProvider',function ($routeProvider) {
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
            templateUrl: 'views/players.html',
            controller: 'PlayersCtrl'
        })
        .when('/weapons', {
            templateUrl: 'views/weapons.html',
            controller: 'WeaponsCtrl'
        })
        .when('/player/:param', {
            templateUrl: 'views/player.html',
            controller: 'PlayerCtrl'
        })
        .when('/stats', {
            templateUrl: 'views/stats.html',
            controller: 'StatsCtrl'
        })
        .when('/admin', {
            templateUrl: 'views/admin.html',
            controller: 'AdminCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

}]);

ZupaStats.run(['$rootScope','$location','$http',
    function($rootScope,$location,$http) {
        var globalScope = $rootScope;
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        globalScope.players = [];
        globalScope.weapons = [];
        globalScope.weapons3 = [];
        globalScope.weapons4 = [];
        globalScope.weapons2 = [];
        globalScope.players3 = [];
        globalScope.players4 = [];
        globalScope.players2 = [];
        globalScope.players5 = [];
        globalScope.players6 = [];
        globalScope.data = [];
        globalScope.serverURL = 'http://localhost:9002/git/ZupaStats/laravel/zupastats';
        globalScope.servers = [];
        globalScope.angular = 'Zupa';
        globalScope.version = '2.0';
        globalScope.communnity = '';
        globalScope.selectedServer =  {};

        $http.post(globalScope.serverURL + '/public/index.php/servers').
            success(function(data, status, headers, config) {
                globalScope.servers = data;
                globalScope.selectedServer =  globalScope.servers[0];
                globalScope.communnity =  globalScope.selectedServer.community;
                unEpochorize(data);
            }).error(function(error){
                alert("No server connection or misformed config file");
            });


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
            $http.post(globalScope.serverURL + '/public/index.php/stats',{"db" : globalScope.selectedServer.dbi }).
                success(function(data, status, headers, config) {
                    globalScope.data = data;
                    unEpochorize(data);

                }).error(function(error){
                    globalScope.loadingData = false;
                });
        }
        globalScope.unEpochorize = unEpochorize;

        function unEpochorize(data){
            globalScope.players = {};
            globalScope.weapons = {};

            var now = new Date();


            angular.forEach(data, function (value, key) {
                if(value.killerpuid != undefined && value.killerpuid != ""){
                    if(!(value.killerpuid in globalScope.players)){
                        globalScope.players[value.killerpuid] = {};
                        globalScope.players[value.killerpuid].names = [];
                        globalScope.players[value.killerpuid].puid = value.killerpuid;
                        globalScope.players[value.killerpuid].killsData = [];
                        globalScope.players[value.killerpuid].killedData = [];
                        globalScope.players[value.killerpuid].killsData7Days = [];
                        globalScope.players[value.killerpuid].killedData7Days = [];
                        globalScope.players[value.killerpuid].weapons = {};
                    }
                    if($.inArray(value.killername, globalScope.players[value.killerpuid].names) == -1){
                        globalScope.players[value.killerpuid].names.push(value.killername);
                    }


                    if(value.killedpuid != undefined && value.killedpuid != "" && value.killedpuid != " "){
                        globalScope.players[value.killerpuid].killsData.push(value);

                        var date = new Date(value.time);
                        var timeDiff = Math.abs(now.getTime() - date.getTime());
                        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                        if(diffDays < 8){
                            globalScope.players[value.killerpuid].killsData7Days.push(value);
                        }


                    }
                }
                if(value.killedpuid != undefined && value.killedpuid != ""){
                    if(!(value.killedpuid in globalScope.players)){
                        globalScope.players[value.killedpuid] = {};
                        globalScope.players[value.killedpuid].names = [];
                        globalScope.players[value.killedpuid].killsData = [];
                        globalScope.players[value.killedpuid].puid = value.killedpuid;
                        globalScope.players[value.killedpuid].killedData = [];
                        globalScope.players[value.killedpuid].killsData7Days = [];
                        globalScope.players[value.killedpuid].killedData7Days = [];
                        globalScope.players[value.killedpuid].weapons = {};
                    }
                    if($.inArray(value.killedname, globalScope.players[value.killedpuid].names) == -1){
                        globalScope.players[value.killedpuid].names.push(value.killedname);
                    }
                    globalScope.players[value.killedpuid].killedData.push(value);

                    var date = new Date(value.time);
                    var timeDiff = Math.abs(now.getTime() - date.getTime());
                    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    if(diffDays < 8){
                        globalScope.players[value.killedpuid].killedData7Days.push(value);
                    }

                }else{

                }
                if(value.weapon != undefined && value.weapon != "" && value.weapon != " "){
                    if(!(value.weapon.trim() in globalScope.weapons)){
                        globalScope.weapons[value.weapon.trim()] = {};
                        globalScope.weapons[value.weapon.trim()].name = value.weapon;
                        globalScope.weapons[value.weapon.trim()].count = 0;
                    }
                    globalScope.weapons[value.weapon].count++;

                    if(value.killerpuid != undefined && value.killerpuid !=""){
                        if(!(value.weapon.trim() in globalScope.players[value.killerpuid].weapons)){
                            globalScope.players[value.killerpuid].weapons[value.weapon.trim()] = {};
                            globalScope.players[value.killerpuid].weapons[value.weapon.trim()].name = value.weapon;
                            globalScope.players[value.killerpuid].weapons[value.weapon.trim()].count = 0;
                        }
                        globalScope.players[value.killerpuid].weapons[value.weapon].count++;
                    }
                }
            });

            globalScope.weapons2 = [];
            angular.forEach(globalScope.weapons, function (value, key) {
                globalScope.weapons2.push(value);
            });

            globalScope.weapons2.sort(compareWeaponKills);

            globalScope.players2 = [];
            angular.forEach(globalScope.players, function (value, key) {

                if(value.killedData.length == 0)
                    value.kd = value.killsData.length ;
                else
                    value.kd = value.killsData.length / value.killedData.length;

                if(value.killedData7Days.length == 0)
                    value.kd7 = value.killsData7Days.length ;
                else
                    value.kd7 = value.killsData7Days.length / value.killedData7Days.length;


                globalScope.players2.push(value);
            });

            globalScope.players2.sort(compareKills7);

            angular.forEach(globalScope.players2, function (value, key) {
                globalScope.players6.push(value);
            });





            globalScope.players2.sort(compareKills);

            globalScope.weapons3 = [];
            var counter = 1;
            angular.forEach(globalScope.weapons2, function (value, key) {
                value.rank = counter;
                globalScope.weapons3.push(value);
                counter++;
            });
            counter = 1;

            globalScope.players3 = [];
            angular.forEach(globalScope.players2, function (value, key) {
                value.rank = counter;

                globalScope.players3.push(value);
                counter++;
            });

            globalScope.players2.sort(compareKD);

            counter = 1;
            globalScope.players4 = [];
            angular.forEach(globalScope.players2, function (value, key) {
                value.kdrank = counter;
                if(value.killsData.length > 19){
                    globalScope.players4.push(value);
                    counter++;
                }
            });

            globalScope.players2.sort(compareKD7);

            counter = 1;
            globalScope.players5 = [];
            angular.forEach(globalScope.players2, function (value, key) {
                value.kdrank = counter;

                if(value.killsData.length > 9){
                    globalScope.players5.push(value);
                    counter++;
                }
            });

            globalScope.loadingData = false;

        }


        function compareWeaponKills(a,b) {
            if (a.count < b.count)
                return 1;
            if (a.count > b.count)
                return -1;
            return 0;
        }

        function compareKills(a,b) {
            if (a.killsData.length < b.killsData.length)
                return 1;
            if (a.killsData.length > b.killsData.length)
                return -1;
            return 0;
        }

        function compareKills7(a,b) {
            if (a.killsData7Days.length < b.killsData7Days.length)
                return 1;
            if (a.killsData7Days.length > b.killsData7Days.length)
                return -1;
            return 0;
        }


        function compareKD(a,b) {
            if (a.kd < b.kd)
                return 1;
            if (a.kd > b.kd)
                return -1;
            return 0;
        }

        function compareKD7(a,b) {
            if (a.kd7 < b.kd7)
                return 1;
            if (a.kd7 > b.kd7)
                return -1;
            return 0;
        }


    }]);

ZupaStats.directive('focus', function() {
    return function(scope, element) {
        element[0].focus();
    }
});

ZupaStats.directive('passwordMatch', [function () {
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