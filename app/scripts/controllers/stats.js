'use strict';

/**
 * @ngdoc function
 * @name zepochRedisApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zepochRedisApp
 */
ERDBM
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

        MC.weaponsTop = []
        MC.kdrTop = [];
        MC.killsTop = [];


        RS.$watch('players4', function() {

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
                stats.label = value.names[0]  + ' : ' + value.killsData.length;
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
