// Animals service used to communicate Animals REST endpoints
(function () {
  'use strict';

  angular
    .module('animals')
    .factory('AnimalsService', AnimalsService);

  AnimalsService.$inject = ['$resource'];

  function AnimalsService($resource) {
    return $resource('api/animals/:animalId', {
      animalId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
