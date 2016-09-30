'use strict';

describe('Fairs E2E Tests:', function () {
  describe('Test Fairs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/fairs');
      expect(element.all(by.repeater('fair in fairs')).count()).toEqual(0);
    });
  });
});
