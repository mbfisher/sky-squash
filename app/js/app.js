'use strict';


// Declare app level module which depends on filters, and services
angular.module('skySquash', [
    'ngRoute',
    'skySquash.filters',
    'skySquash.services',
    'skySquash.directives',
    'skySquash.controllers',
    'firebase'
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'partials/index.html',
        controller: 'IndexCtrl',
        resolve: {
            'currentUser': ['auth', function (auth) {
                return auth.$getCurrentUser();
            }]
        }
    });
    $routeProvider.otherwise({redirectTo: '/'});
}]);
