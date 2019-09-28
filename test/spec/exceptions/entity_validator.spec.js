const { expect } = require('chai');
const JDLEntity = require('../../../lib/core/jdl_entity');
const JDLField = require('../../../lib/core/jdl_field');
const JDLValidation = require('../../../lib/core/jdl_validation');
const { checkEntity } = require('../../../lib/exceptions/entity_validator');

describe('EntityValidator', () => {
  describe('checkEntity', () => {
    context('when not passing an entity', () => {
      it('should fail', () => {
        expect(() => checkEntity()).to.throw(/^No entity$/);
      });
    });
    context('when passing an entity', () => {
      context('with every required attribute', () => {
        it('should not fail', () => {
          expect(() =>
            checkEntity(
              new JDLEntity({
                name: 'A'
              })
            )
          ).not.to.throw();
        });
      });
      context('without any attribute', () => {
        it('should fail', () => {
          expect(() => checkEntity({})).to.throw(/^The entity attributes name,tableName,fields were not found\.$/);
        });
      });
      context('with fields', () => {
        context('when there are valid', () => {
          let entity;

          before(() => {
            entity = new JDLEntity({
              name: 'A',
              tableName: 'a'
            });
            const field = new JDLField({
              name: 'aa',
              type: 'String'
            });
            const validation = new JDLValidation({
              name: 'required'
            });
            field.addValidation(validation);
            entity.addField(field);
          });

          it('should not fail', () => {
            expect(() => checkEntity(entity)).not.to.throw();
          });
        });
        context('when there are not valid', () => {
          context('because there is no field', () => {
            let entity;

            before(() => {
              entity = new JDLEntity({
                name: 'A'
              });
              const field = new JDLField({
                name: 'aa',
                type: 'Integer'
              });
              entity.addField(field);
              entity.fields.aa = undefined;
            });

            it('should fail', () => {
              expect(() => checkEntity(entity)).to.throw(/^Entity A,\n\tNo field\.$/);
            });
          });
          context('because there is an error in the field', () => {
            let entity;

            before(() => {
              entity = new JDLEntity({
                name: 'A'
              });
              const field = new JDLField({
                name: 'aa',
                type: 'String'
              });
              entity.addField(field);
              delete entity.fields.aa.type;
            });

            it('should fail', () => {
              expect(() => checkEntity(entity)).to.throw(/^Entity A,\n\tThe field attribute type was not found\.$/);
            });
          });
          context('because there is an error in the validation', () => {
            let entity;

            before(() => {
              entity = new JDLEntity({
                name: 'A'
              });
              const field = new JDLField({
                name: 'aa',
                type: 'String'
              });
              const validation = new JDLValidation({
                name: 'min',
                value: 42
              });
              field.addValidation(validation);
              entity.addField(field);
              entity.fields.aa.validations.min.value = undefined;
            });

            it('should fail', () => {
              expect(() => checkEntity(entity)).to.throw(
                /^Entity A,\n\tField aa, \n\tThe validation min requires a value\.$/
              );
            });
          });
        });
      });
    });
  });
});
