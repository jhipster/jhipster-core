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

const { checkField } = require('./field_validator');

let jdlEntity;

module.exports = {
  checkEntity
};

/**
 * Checks whether a JDL entity is valid.
 * @param entity the entity to check.
 * @throws if the entity is invalid.
 */
function checkEntity(entity) {
  if (!entity) {
    throw new Error('No entity');
  }
  jdlEntity = entity;
  checkForAbsentAttributes();
  checkFields();
}

function checkForAbsentAttributes() {
  const absentAttributes = [];
  ['name', 'tableName'].forEach(attribute => {
    if (!jdlEntity[attribute]) {
      absentAttributes.push(attribute);
    }
  });
  if (!('fields' in jdlEntity)) {
    absentAttributes.push('fields');
  }
  if (absentAttributes.length !== 0) {
    const plural = absentAttributes.length > 1;
    throw new Error(
      `The entity attribute${plural ? 's' : ''} ${absentAttributes.join(',')} ${plural ? 'were not' : 'was not'} found.`
    );
  }
}

function checkFields() {
  const errorsPerField = {};
  jdlEntity.forEachField((field, index) => {
    try {
      if (!field) {
        errorsPerField[`field #${index + 1}`] = 'No field.';
        return;
      }
      checkField(field);
    } catch (error) {
      errorsPerField[field.name || 'no name'] = error.message;
    }
  });
  if (Object.keys(errorsPerField).length === 0) {
    return;
  }
  throw new Error(formatFieldErrors(errorsPerField));
}

function formatFieldErrors(errorsPerField) {
  const errors = Object.keys(errorsPerField).reduce((previous, field) => {
    return `${previous}\n\t${errorsPerField[field]}`;
  }, '');
  return `Entity ${jdlEntity.name},${errors}`;
}
