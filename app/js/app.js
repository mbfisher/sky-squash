'use strict';


// Declare app level module which depends on filters, and services
angular.module('skySquash', [
    'ngRoute',
    'skySquash.filters',
    'skySquash.services',
    'skySquash.directives',
    'skySquash.controllers',
    'firebase',
    'ui.bootstrap'
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'app.html',
        controller: 'AppCtrl',
        resolve: {
            'user': ['user', function (user) {
                return user.$loaded();
            }]
        }
    });
    $routeProvider.otherwise({redirectTo: '/'});
}]);
