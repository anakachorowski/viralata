(function () {
  'use strict';

  angular
    .module('adopters')
    .controller('AdoptersListController', AdoptersListController);

  AdoptersListController.$inject = ['AdoptersService'];

  function AdoptersListController(AdoptersService) {
    var vm = this;

    vm.adopters = AdoptersService.query();
  }
}());
