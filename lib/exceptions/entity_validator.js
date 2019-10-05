/** Copyright 2013-2019 the original author or authors from the JHipster project.
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

const Validator = require('./validator');
const FieldValidator = require('./field_validator');

class EntityValidator extends Validator {
  constructor() {
    super('entity', ['name', 'tableName']);
  }

  validate(jdlEntity) {
    super.validate(jdlEntity);
    checkFields(jdlEntity);
  }
}

module.exports = EntityValidator;

function checkFields(jdlEntity) {
  if (!('fields' in jdlEntity)) {
    throw new Error('No fields.');
  }
  const errorsPerField = {};
  const fieldValidator = new FieldValidator();
  jdlEntity.forEachField((field, index) => {
    try {
      if (!field) {
        errorsPerField[`field #${index + 1}`] = 'No field.';
        return;
      }
      fieldValidator.validate(field);
    } catch (error) {
      errorsPerField[field.name || 'no name'] = error.message;
    }
  });
  if (Object.keys(errorsPerField).length === 0) {
    return;
  }
  throw new Error(formatFieldErrors(jdlEntity, errorsPerField));
}

function formatFieldErrors(jdlEntity, errorsPerField) {
  const errors = Object.keys(errorsPerField).reduce((previous, field) => {
    return `${previous}\n\t${errorsPerField[field]}`;
  }, '');
  return `Entity ${jdlEntity.name},${errors}`;
}
