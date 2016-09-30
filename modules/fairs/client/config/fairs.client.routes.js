(function () {
  'use strict';

  angular
    .module('fairs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('fairs', {
        abstract: true,
        url: '/fairs',
        template: '<ui-view/>'
      })
      .state('fairs.list', {
        url: '',
        templateUrl: 'modules/fairs/client/views/list-fairs.client.view.html',
        controller: 'FairsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Fairs List'
        }
      })
      .state('fairs.create', {
        url: '/create',
        templateUrl: 'modules/fairs/client/views/form-fair.client.view.html',
        controller: 'FairsController',
        controllerAs: 'vm',
        resolve: {
          fairResolve: newFair
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Fairs Create'
        }
      })
      .state('fairs.edit', {
        url: '/:fairId/edit',
        templateUrl: 'modules/fairs/client/views/form-fair.client.view.html',
        controller: 'FairsController',
        controllerAs: 'vm',
        resolve: {
          fairResolve: getFair
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Fair {{ fairResolve.name }}'
        }
      })
      .state('fairs.view', {
        url: '/:fairId',
        templateUrl: 'modules/fairs/client/views/view-fair.client.view.html',
        controller: 'FairsController',
        controllerAs: 'vm',
        resolve: {
          fairResolve: getFair
        },
        data: {
          pageTitle: 'Fair {{ fairResolve.name }}'
        }
      });
  }

  getFair.$inject = ['$stateParams', 'FairsService'];

  function getFair($stateParams, FairsService) {
    return FairsService.get({
      fairId: $stateParams.fairId
    }).$promise;
  }

  newFair.$inject = ['FairsService'];

  function newFair(FairsService) {
    return new FairsService();
  }
}());
