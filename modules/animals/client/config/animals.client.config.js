(function () {
  'use strict';

  angular
    .module('animals')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Animals',
      state: 'animals',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'animals', {
      title: 'List Animals',
      state: 'animals.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'animals', {
      title: 'Create Animal',
      state: 'animals.create',
      roles: ['user']
    });
  }
}());
