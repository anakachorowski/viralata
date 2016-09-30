(function () {
  'use strict';

  angular
    .module('fairs')
    .controller('FairsListController', FairsListController);

  FairsListController.$inject = ['FairsService'];

  function FairsListController(FairsService) {
    var vm = this;

    vm.fairs = FairsService.query();
  }
}());
