(function () {
  'use strict';

  angular
    .module('animals')
    .controller('AnimalsListController', AnimalsListController);

  AnimalsListController.$inject = ['AnimalsService'];

  function AnimalsListController(AnimalsService) {
    var vm = this;

    vm.animals = AnimalsService.query();
  }
}());
