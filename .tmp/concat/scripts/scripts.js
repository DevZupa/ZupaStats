'use strict';
/**
 * @ngdoc overview
 * @name zepochRedisApp
 * @description
 * # zepochRedisApp
 *
 * Main module of the application.
 */
var ZupaStats = angular
  .module('ZupaStats', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'angularLocalStorage',
    'ui.bootstrap',
    'angularUtils.directives.dirPagination',
        'toaster',
        'tc.chartjs'
  ]);
ZupaStats.config(["$routeProvider",function ($routeProvider) {
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
      .otherwise({
        redirectTo: '/'
      });
  }]);

ZupaStats.run(["$rootScope","storage","$location","$http","Data",
    function($rootScope,storage,$location,$http,Data) {
        var globalScope = $rootScope;
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
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
        globalScope.serverURL = "server/";
        globalScope.servers = [];
        globalScope.angular = "Zupa";
        globalScope.version = "1.0";
        globalScope.communnity = "";
        globalScope.selectedServer =  {};

        $http.post(globalScope.serverURL + 'getServers.php?date='+ new Date().getTime(),{"db" : globalScope.selectedServer.dbi }).
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
        $http.post(globalScope.serverURL + 'getNoLogDeathLogs.php?date='+ new Date().getTime(),{"db" : globalScope.selectedServer.dbi }).
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

ZupaStats.factory("Data", ['$http', 'toaster',
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
'use strict';

/**
 * @ngdoc function
 * @name zepochRedisApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zepochRedisApp
 */
ZupaStats
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

'use strict';

/**
 * @ngdoc function
 * @name zepochRedisApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zepochRedisApp
 */
ZupaStats
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

'use strict';

/**
 * @ngdoc function
 * @name zepochRedisApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zepochRedisApp
 */
ZupaStats
  .controller('StatsCtrl',["$scope","$rootScope","$location","$http", function ($scope,$rootScope,$location,$http) {
        $(".nav li").removeClass("active");
        $("#stats").addClass("active");

        var MC = $scope;
        var RS = $rootScope;

        MC.changeLoc = changeLoc;

        MC.selectServer = selectServer;

        function selectServer(index){
            RS.selectedServer =  RS.servers[index];
            changeLoc("/kills");
        }

        function changeLoc(where){
            $location.path(where);
        }

        MC.weaponsTop = [];
        MC.kdrTop = [];
        MC.killsTop = [];
        MC.killsTop7 = [];
        MC.kdTop7 = [];


        RS.$watch('players5', function() {

            refreshStats();
        });

        function refreshStats(){

        MC.tempDate = [];

        var counter = 0

        angular.forEach(RS.weapons3, function (value, key) {

            if( counter < 5) {
                var stats = {};
                stats.value = value.count;
                stats.color = RS.getRandomColor();
                stats.highlight = "#aaa";
                stats.label = value.name;
                MC.tempDate.push(stats);
                counter++;
            };
        });

        MC.weaponsTop = MC.tempDate;

        MC.tempDate = [];

        counter = 0

        angular.forEach(RS.players4, function (value, key) {

            if( counter < 5) {
                var stats = {};
                stats.value = value.kd;
                stats.color = RS.getRandomColor();
                stats.highlight = "#aaa";
                stats.label = value.names[0];
                MC.tempDate.push(stats);
                counter++;
            };
        });

        MC.kdrTop = MC.tempDate;


        MC.tempDate = [];

        counter = 0

        angular.forEach(RS.players3, function (value, key) {

            if( counter < 5) {
                var stats = {};
                stats.value = value.killsData.length;
                stats.color = RS.getRandomColor();
                stats.highlight = "#aaa";
                stats.label = value.names[0];
                MC.tempDate.push(stats);
                counter++;
            };
        });

        MC.killsTop = MC.tempDate;


            MC.tempDate = [];

            counter = 0

            angular.forEach(RS.players6, function (value, key) {

                if( counter < 5) {
                    var stats = {};
                    stats.value = value.killsData7Days.length;
                    stats.color = RS.getRandomColor();
                    stats.highlight = "#aaa";
                    stats.label = value.names[0];
                    MC.tempDate.push(stats);
                    counter++;
                };
            });

            MC.killsTop7 = MC.tempDate;

            MC.tempDate = [];

            counter = 0

            angular.forEach(RS.players5, function (value, key) {

                if( counter < 5) {
                    var stats = {};
                    stats.value = value.kd7;
                    stats.color = RS.getRandomColor();
                    stats.highlight = "#aaa";
                    stats.label = value.names[0];
                    MC.tempDate.push(stats);
                    counter++;
                };
            });

            MC.kdTop7 = MC.tempDate;

        }



        $scope.options =  {

            // Sets the chart to be responsive
            responsive: false,

            //Boolean - Whether we should show a stroke on each segment
            segmentShowStroke : true,

            //String - The colour of each segment stroke
            segmentStrokeColor : '#fff',

            //Number - The width of each segment stroke
            segmentStrokeWidth : 2,

            //Number - The percentage of the chart that we cut out of the middle
            percentageInnerCutout : 0, // This is 0 for Pie charts

            //Number - Amount of animation steps
            animationSteps : 100,

            //String - Animation easing effect
            animationEasing : 'easeOutBounce',

            //Boolean - Whether we animate the rotation of the Doughnut
            animateRotate : true,

            //Boolean - Whether we animate scaling the Doughnut from the centre
            animateScale : true,

            //String - A legend template
            legendTemplate : '<ul class="tc-chart-js-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'

        };

        $scope.optionsPolar =  {

            // Sets the chart to be responsive
            responsive: true,

            //Boolean - Show a backdrop to the scale label
            scaleShowLabelBackdrop : true,

            //String - The colour of the label backdrop
            scaleBackdropColor : 'rgba(255,255,255,0.75)',

            // Boolean - Whether the scale should begin at zero
            scaleBeginAtZero : true,

            //Number - The backdrop padding above & below the label in pixels
            scaleBackdropPaddingY : 2,

            //Number - The backdrop padding to the side of the label in pixels
            scaleBackdropPaddingX : 2,

            //Boolean - Show line for each value in the scale
            scaleShowLine : true,

            //Boolean - Stroke a line around each segment in the chart
            segmentShowStroke : true,

            //String - The colour of the stroke on each segement.
            segmentStrokeColor : '#fff',

            //Number - The width of the stroke value in pixels
            segmentStrokeWidth : 2,

            //Number - Amount of animation steps
            animationSteps : 100,

            //String - Animation easing effect.
            animationEasing : 'easeOutBounce',

            //Boolean - Whether to animate the rotation of the chart
            animateRotate : true,

            //Boolean - Whether to animate scaling the chart from the centre
            animateScale : false,

            //String - A legend template
            legendTemplate : '<ul class="tc-chart-js-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'
        };



  }]);
