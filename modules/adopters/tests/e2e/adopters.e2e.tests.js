'use strict';

describe('Adopters E2E Tests:', function () {
  describe('Test Adopters page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/adopters');
      expect(element.all(by.repeater('adopter in adopters')).count()).toEqual(0);
    });
  });
});
