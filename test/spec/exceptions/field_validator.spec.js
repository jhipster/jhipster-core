const { expect } = require('chai');
const JDLField = require('../../../lib/core/jdl_field');
const JDLValidation = require('../../../lib/core/jdl_validation');
const FieldValidator = require('../../../lib/exceptions/field_validator');

describe('FieldValidator', () => {
  let validator;

  before(() => {
    validator = new FieldValidator();
  });

  describe('validate', () => {
    context('when not passing anything', () => {
      it('should fail', () => {
        expect(() => validator.validate()).to.throw(/^No field\.$/);
      });
    });
    context('when passing a field', () => {
      context('with all its required attributes', () => {
        let field;

        before(() => {
          field = new JDLField({
            name: 'a',
            type: 'String'
          });
        });

        it('should not fail', () => {
          expect(() => validator.validate(field)).not.to.throw();
        });
      });
      context('when not passing any attribute', () => {
        it('should fail', () => {
          expect(() => validator.validate({})).to.throw(/^The field attributes name, type were not found\.$/);
        });
      });
      context('with validations', () => {
        context('when there are valid', () => {
          let field;

          before(() => {
            field = new JDLField({
              name: 'a',
              type: 'String'
            });
            const validation = new JDLValidation({
              name: 'required'
            });
            field.addValidation(validation);
          });

          it('should not fail', () => {
            expect(() => validator.validate(field)).not.to.throw();
          });
        });
        context('when there are invalid', () => {
          let field;

          before(() => {
            field = new JDLField({
              name: 'a',
              type: 'String'
            });
            const validation1 = new JDLValidation({
              name: 'maxlength',
              value: 42
            });
            field.addValidation(validation1);
            const validation2 = new JDLValidation({
              name: 'minlength',
              value: 0
            });
            field.addValidation(validation2);
            field.validations.maxlength.value = undefined;
            field.validations.minlength = undefined;
          });

          it('should not fail', () => {
            expect(() => validator.validate(field)).to.throw(
              /^Field a, \n\tThe validation maxlength requires a value\.\n\tNo validation\.$/
            );
          });
        });
      });
    });
  });
});
