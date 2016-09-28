(function () {
  'use strict';

  describe('Animals Route Tests', function () {
    // Initialize global variables
    var $scope,
      AnimalsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AnimalsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AnimalsService = _AnimalsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('animals');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/animals');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          AnimalsController,
          mockAnimal;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('animals.view');
          $templateCache.put('modules/animals/client/views/view-animal.client.view.html', '');

          // create mock Animal
          mockAnimal = new AnimalsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Animal Name'
          });

          // Initialize Controller
          AnimalsController = $controller('AnimalsController as vm', {
            $scope: $scope,
            animalResolve: mockAnimal
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:animalId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.animalResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            animalId: 1
          })).toEqual('/animals/1');
        }));

        it('should attach an Animal to the controller scope', function () {
          expect($scope.vm.animal._id).toBe(mockAnimal._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/animals/client/views/view-animal.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AnimalsController,
          mockAnimal;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('animals.create');
          $templateCache.put('modules/animals/client/views/form-animal.client.view.html', '');

          // create mock Animal
          mockAnimal = new AnimalsService();

          // Initialize Controller
          AnimalsController = $controller('AnimalsController as vm', {
            $scope: $scope,
            animalResolve: mockAnimal
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.animalResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/animals/create');
        }));

        it('should attach an Animal to the controller scope', function () {
          expect($scope.vm.animal._id).toBe(mockAnimal._id);
          expect($scope.vm.animal._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/animals/client/views/form-animal.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AnimalsController,
          mockAnimal;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('animals.edit');
          $templateCache.put('modules/animals/client/views/form-animal.client.view.html', '');

          // create mock Animal
          mockAnimal = new AnimalsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Animal Name'
          });

          // Initialize Controller
          AnimalsController = $controller('AnimalsController as vm', {
            $scope: $scope,
            animalResolve: mockAnimal
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:animalId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.animalResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            animalId: 1
          })).toEqual('/animals/1/edit');
        }));

        it('should attach an Animal to the controller scope', function () {
          expect($scope.vm.animal._id).toBe(mockAnimal._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/animals/client/views/form-animal.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
