(function () {
  'use strict';

  // Adopters controller
  angular
    .module('adopters')
    .controller('AdoptersController', AdoptersController);

  AdoptersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'adopterResolve'];

  function AdoptersController ($scope, $state, $window, Authentication, adopter) {
    var vm = this;

    vm.authentication = Authentication;
    vm.adopter = adopter;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Adopter
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.adopter.$remove($state.go('adopters.list'));
      }
    }

    // Save Adopter
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.adopterForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.adopter._id) {
        vm.adopter.$update(successCallback, errorCallback);
      } else {
        vm.adopter.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('adopters.view', {
          adopterId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
