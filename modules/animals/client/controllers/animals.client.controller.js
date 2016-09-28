(function () {
  'use strict';

  // Animals controller
  angular
    .module('animals')
    .controller('AnimalsController', AnimalsController);

  AnimalsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'animalResolve'];

  function AnimalsController ($scope, $state, $window, Authentication, animal) {
    var vm = this;

    vm.authentication = Authentication;
    vm.animal = animal;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Animal
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.animal.$remove($state.go('animals.list'));
      }
    }

    // Save Animal
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.animalForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.animal._id) {
        vm.animal.$update(successCallback, errorCallback);
      } else {
        vm.animal.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('animals.view', {
          animalId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
