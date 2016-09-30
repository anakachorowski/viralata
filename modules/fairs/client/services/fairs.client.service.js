// Fairs service used to communicate Fairs REST endpoints
(function () {
  'use strict';

  angular
    .module('fairs')
    .factory('FairsService', FairsService);

  FairsService.$inject = ['$resource'];

  function FairsService($resource) {
    return $resource('api/fairs/:fairId', {
      fairId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
