'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
  beforeEach(module('skySquash.controllers'));


  it('should ....', inject(function($controller) {
    //spec body
    var AppCtrl = $controller('AppCtrl', { $scope: {}, auth: {} });
    expect(AppCtrl).toBeDefined();
  }));
});
