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

const { exists, needsValue } = require('../core/jhipster/validations');

let jdlValidation;

module.exports = {
  checkValidation
};

function checkValidation(validation) {
  if (!validation) {
    throw new Error('No validation.');
  }
  jdlValidation = validation;
  checkForAbsentAttributes();
  checkForInvalidName();
  checkForRequiredValue();
}

function checkForAbsentAttributes() {
  if (!jdlValidation.name) {
    throw new Error('The validation name was not found.');
  }
}

function checkForInvalidName() {
  if (!exists(jdlValidation.name)) {
    throw new Error(`The validation ${jdlValidation.name} doesn't exist.`);
  }
}

function checkForRequiredValue() {
  if (jdlValidation.value == null && needsValue(jdlValidation.name)) {
    throw new Error(`The validation ${jdlValidation.name} requires a value.`);
  }
}
