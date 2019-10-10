/**
 * Copyright 2013-2019 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see http://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { expect } = require('chai');
const JDLEntity = require('../../../lib/core/jdl_entity');
const JDLField = require('../../../lib/core/jdl_field');
const JDLValidation = require('../../../lib/core/jdl_validation');
const EntityValidator = require('../../../lib/exceptions/entity_validator');

describe('EntityValidator', () => {
  let validator;

  before(() => {
    validator = new EntityValidator();
  });

  describe('validate', () => {
    context('when not passing an entity', () => {
      it('should fail', () => {
        expect(() => validator.validate()).to.throw(/^No entity\.$/);
      });
    });
    context('when passing an entity', () => {
      context('with every required attribute', () => {
        it('should not fail', () => {
          expect(() =>
            validator.validate(
              new JDLEntity({
                name: 'A'
              })
            )
          ).not.to.throw();
        });
      });
      context('without any attribute', () => {
        it('should fail', () => {
          expect(() => validator.validate({})).to.throw(/^The entity attributes name, tableName were not found\.$/);
        });
      });
      context('without fields', () => {
        it('should fail', () => {
          it('should fail', () => {
            expect(() => validator.validate({ name: 'A', tableName: 'a' })).to.throw(
              /^The entity attributes name, tableName were not found\.$/
            );
          });
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
            expect(() => validator.validate(entity)).not.to.throw();
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
              expect(() => validator.validate(entity)).to.throw(/^Entity A,\n\tNo field\.$/);
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
              expect(() => validator.validate(entity)).to.throw(
                /^Entity A,\n\tThe field attribute type was not found\.$/
              );
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
              expect(() => validator.validate(entity)).to.throw(
                /^Entity A,\n\tField aa, \n\tThe validation min requires a value\.$/
              );
            });
          });
        });
      });
    });
  });
});
