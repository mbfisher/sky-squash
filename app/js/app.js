'use strict';


// Declare app level module which depends on filters, and services
angular.module('skySquash', [
  'ngRoute',
  'skySquash.filters',
  'skySquash.services',
  'skySquash.directives',
  'skySquash.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {templateUrl: 'partials/index.html', controller: 'IndexCtrl'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);
