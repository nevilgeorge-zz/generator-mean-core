// controller.js template
'use strict';

/**
 * @ngdoc function
 * @name <%= appName %>.controller:<%= controllerName %>Ctrl
 * @description
 * # <%= controllerName %>Ctrl
 * Controller of the <%= appName %>
 */
angular.module('<%= appName %>')
  .controller('<%= controllerName %>Ctrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });