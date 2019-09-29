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

const { checkValidation } = require('./validation_validator');

let jdlField;

module.exports = {
  checkField
};

function checkField(field) {
  if (!field) {
    throw new Error('No field.');
  }
  jdlField = field;
  checkForAbsentAttributes();
  checkValidations();
}

function checkForAbsentAttributes() {
  const absentAttributes = [];
  ['name', 'type'].forEach(attribute => {
    if (!jdlField[attribute]) {
      absentAttributes.push(attribute);
    }
  });
  if (absentAttributes.length !== 0) {
    const plural = absentAttributes.length > 1;
    throw new Error(
      `The field attribute${plural ? 's' : ''} ${absentAttributes.join(', ')} ${plural ? 'were not' : 'was not'} found.`
    );
  }
}

function checkValidations() {
  const errorsPerValidation = {};
  jdlField.forEachValidation((validation, index) => {
    try {
      if (!validation) {
        errorsPerValidation[`field #${index + 1}`] = 'No validation.';
        return;
      }
      checkValidation(validation);
    } catch (error) {
      errorsPerValidation[validation.name] = error.message;
    }
  });
  if (Object.keys(errorsPerValidation).length === 0) {
    return;
  }
  throw new Error(formatValidationErrors(errorsPerValidation));
}

function formatValidationErrors(errorsPerValidation) {
  const errors = Object.keys(errorsPerValidation).reduce((previous, validation) => {
    return `${previous}\n\t${errorsPerValidation[validation]}`;
  }, '');
  return `Field ${jdlField.name}, ${errors}`;
}
