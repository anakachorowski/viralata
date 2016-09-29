// Adopters service used to communicate Adopters REST endpoints
(function () {
  'use strict';

  angular
    .module('adopters')
    .factory('AdoptersService', AdoptersService);

  AdoptersService.$inject = ['$resource'];

  function AdoptersService($resource) {
    return $resource('api/adopters/:adopterId', {
      adopterId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
