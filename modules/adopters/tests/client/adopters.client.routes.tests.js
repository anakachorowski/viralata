(function () {
  'use strict';

  describe('Adopters Route Tests', function () {
    // Initialize global variables
    var $scope,
      AdoptersService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AdoptersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AdoptersService = _AdoptersService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('adopters');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/adopters');
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
          AdoptersController,
          mockAdopter;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('adopters.view');
          $templateCache.put('modules/adopters/client/views/view-adopter.client.view.html', '');

          // create mock Adopter
          mockAdopter = new AdoptersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Adopter Name'
          });

          // Initialize Controller
          AdoptersController = $controller('AdoptersController as vm', {
            $scope: $scope,
            adopterResolve: mockAdopter
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:adopterId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.adopterResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            adopterId: 1
          })).toEqual('/adopters/1');
        }));

        it('should attach an Adopter to the controller scope', function () {
          expect($scope.vm.adopter._id).toBe(mockAdopter._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/adopters/client/views/view-adopter.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AdoptersController,
          mockAdopter;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('adopters.create');
          $templateCache.put('modules/adopters/client/views/form-adopter.client.view.html', '');

          // create mock Adopter
          mockAdopter = new AdoptersService();

          // Initialize Controller
          AdoptersController = $controller('AdoptersController as vm', {
            $scope: $scope,
            adopterResolve: mockAdopter
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.adopterResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/adopters/create');
        }));

        it('should attach an Adopter to the controller scope', function () {
          expect($scope.vm.adopter._id).toBe(mockAdopter._id);
          expect($scope.vm.adopter._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/adopters/client/views/form-adopter.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AdoptersController,
          mockAdopter;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('adopters.edit');
          $templateCache.put('modules/adopters/client/views/form-adopter.client.view.html', '');

          // create mock Adopter
          mockAdopter = new AdoptersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Adopter Name'
          });

          // Initialize Controller
          AdoptersController = $controller('AdoptersController as vm', {
            $scope: $scope,
            adopterResolve: mockAdopter
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:adopterId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.adopterResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            adopterId: 1
          })).toEqual('/adopters/1/edit');
        }));

        it('should attach an Adopter to the controller scope', function () {
          expect($scope.vm.adopter._id).toBe(mockAdopter._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/adopters/client/views/form-adopter.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
