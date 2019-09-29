const { expect } = require('chai');
const { checkOptions } = require('../../../lib/exceptions/option_validator');

describe('OptionValidator', () => {
  describe('checkOptions', () => {
    context('when not passing a jdl object', () => {
      it('should fail', () => {
        expect(() => checkOptions()).to.throw(/^A JDL object has to be passed to check its options\.$/);
        expect(() => checkOptions({})).to.throw(/^A JDL object has to be passed to check its options\.$/);
      });
    });
  });
});
