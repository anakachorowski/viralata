(function () {
  'use strict';

  angular
    .module('fairs')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Fairs',
      state: 'fairs',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'fairs', {
      title: 'List Fairs',
      state: 'fairs.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'fairs', {
      title: 'Create Fair',
      state: 'fairs.create',
      roles: ['user']
    });
  }
}());
