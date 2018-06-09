var myApp = angular.module('myApp', ['ui.router', 'uiGmapgoogle-maps']);
debugger;
myApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: 'templates/home.html',
            controller:'carbonEmmissionController'
        })

        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('survey', {
            url:"/survey",
            templateUrl:'templates/survey.html'
        })
        .state("commuteMap",{
            url:"/commuteMap",
            templateUrl:"templates/commuteMap.html",
            controller:"commuteMapController"
        });

});
myApp.config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
  GoogleMapApi.configure({
   key: 'AIzaSyC8AqDQnx5gDUzsYWAZIQjfAkCb9CLZkTo',
   v: '3',
    libraries: 'weather,geometry,visualization,places'
  });
  }])