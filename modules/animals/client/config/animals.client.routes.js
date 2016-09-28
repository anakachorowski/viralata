(function () {
  'use strict';

  angular
    .module('animals')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('animals', {
        abstract: true,
        url: '/animals',
        template: '<ui-view/>'
      })
      .state('animals.list', {
        url: '',
        templateUrl: 'modules/animals/client/views/list-animals.client.view.html',
        controller: 'AnimalsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Animals List'
        }
      })
      .state('animals.create', {
        url: '/create',
        templateUrl: 'modules/animals/client/views/form-animal.client.view.html',
        controller: 'AnimalsController',
        controllerAs: 'vm',
        resolve: {
          animalResolve: newAnimal
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Animals Create'
        }
      })
      .state('animals.edit', {
        url: '/:animalId/edit',
        templateUrl: 'modules/animals/client/views/form-animal.client.view.html',
        controller: 'AnimalsController',
        controllerAs: 'vm',
        resolve: {
          animalResolve: getAnimal
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Animal {{ animalResolve.name }}'
        }
      })
      .state('animals.view', {
        url: '/:animalId',
        templateUrl: 'modules/animals/client/views/view-animal.client.view.html',
        controller: 'AnimalsController',
        controllerAs: 'vm',
        resolve: {
          animalResolve: getAnimal
        },
        data: {
          pageTitle: 'Animal {{ animalResolve.name }}'
        }
      });
  }

  getAnimal.$inject = ['$stateParams', 'AnimalsService'];

  function getAnimal($stateParams, AnimalsService) {
    return AnimalsService.get({
      animalId: $stateParams.animalId
    }).$promise;
  }

  newAnimal.$inject = ['AnimalsService'];

  function newAnimal(AnimalsService) {
    return new AnimalsService();
  }
}());
