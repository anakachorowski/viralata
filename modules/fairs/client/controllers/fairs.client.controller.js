(function () {
  'use strict';

  // Fairs controller
  angular
    .module('fairs')
    .controller('FairsController', FairsController);

  FairsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'fairResolve'];

  function FairsController ($scope, $state, $window, Authentication, fair) {
    var vm = this;

    vm.authentication = Authentication;
    vm.fair = fair;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Fair
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.fair.$remove($state.go('fairs.list'));
      }
    }

    // Save Fair
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.fairForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.fair._id) {
        vm.fair.$update(successCallback, errorCallback);
      } else {
        vm.fair.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('fairs.view', {
          fairId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
