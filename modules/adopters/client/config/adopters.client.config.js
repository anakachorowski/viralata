(function () {
  'use strict';

  angular
    .module('adopters')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Adopters',
      state: 'adopters',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'adopters', {
      title: 'List Adopters',
      state: 'adopters.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'adopters', {
      title: 'Create Adopter',
      state: 'adopters.create',
      roles: ['user']
    });
  }
}());
