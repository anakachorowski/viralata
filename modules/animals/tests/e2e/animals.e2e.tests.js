'use strict';

describe('Animals E2E Tests:', function () {
  describe('Test Animals page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/animals');
      expect(element.all(by.repeater('animal in animals')).count()).toEqual(0);
    });
  });
});
