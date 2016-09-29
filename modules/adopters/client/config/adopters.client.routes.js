(function () {
  'use strict';

  angular
    .module('adopters')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('adopters', {
        abstract: true,
        url: '/adopters',
        template: '<ui-view/>'
      })
      .state('adopters.list', {
        url: '',
        templateUrl: 'modules/adopters/client/views/list-adopters.client.view.html',
        controller: 'AdoptersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Adopters List'
        }
      })
      .state('adopters.create', {
        url: '/create',
        templateUrl: 'modules/adopters/client/views/form-adopter.client.view.html',
        controller: 'AdoptersController',
        controllerAs: 'vm',
        resolve: {
          adopterResolve: newAdopter
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Adopters Create'
        }
      })
      .state('adopters.edit', {
        url: '/:adopterId/edit',
        templateUrl: 'modules/adopters/client/views/form-adopter.client.view.html',
        controller: 'AdoptersController',
        controllerAs: 'vm',
        resolve: {
          adopterResolve: getAdopter
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Adopter {{ adopterResolve.name }}'
        }
      })
      .state('adopters.view', {
        url: '/:adopterId',
        templateUrl: 'modules/adopters/client/views/view-adopter.client.view.html',
        controller: 'AdoptersController',
        controllerAs: 'vm',
        resolve: {
          adopterResolve: getAdopter
        },
        data: {
          pageTitle: 'Adopter {{ adopterResolve.name }}'
        }
      });
  }

  getAdopter.$inject = ['$stateParams', 'AdoptersService'];

  function getAdopter($stateParams, AdoptersService) {
    return AdoptersService.get({
      adopterId: $stateParams.adopterId
    }).$promise;
  }

  newAdopter.$inject = ['AdoptersService'];

  function newAdopter(AdoptersService) {
    return new AdoptersService();
  }
}());
