/** Copyright 2013-2020 the original author or authors from the JHipster project.
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
const UnaryOptionValidator = require('./unary_option_validator');
const BinaryOptionValidator = require('./binary_option_validator');
const { UAA, MICROSERVICE } = require('../core/jhipster/application_types');
const { CASSANDRA } = require('../core/jhipster/database_types');
const { Options } = require('../core/jhipster/binary_options');
const JCoreDefinitions = require('../core/jhipster');

class ApplicationValidator extends Validator {
  constructor() {
    super('application', []);
  }

  validate(jdlApplication, definitions = new JCoreDefinitions()) {
    if (!jdlApplication) {
      throw new Error('An application must be passed to be validated.');
    }
    checkRequiredOptionsAreSet(jdlApplication);
    checkBaseNameAgainstApplicationType(jdlApplication);
    checkLanguageOptions(jdlApplication);
    checkForValidValues(jdlApplication, definitions);
    checkForInvalidDatabaseCombinations(jdlApplication, definitions);
    checkApplicationOptions(jdlApplication);
  }
}

module.exports = ApplicationValidator;

function checkRequiredOptionsAreSet(jdlApplication) {
  if (
    !jdlApplication.hasConfigurationOption('applicationType') ||
    !jdlApplication.hasConfigurationOption('authenticationType') ||
    !jdlApplication.hasConfigurationOption('baseName') ||
    !jdlApplication.hasConfigurationOption('buildTool')
  ) {
    throw new Error(
      'The application applicationType, authenticationType, baseName and buildTool options are required.'
    );
  }
}

function checkBaseNameAgainstApplicationType(jdlApplication) {
  const applicationBaseName = jdlApplication.getConfigurationOptionValue('baseName');
  const applicationType = jdlApplication.getConfigurationOptionValue('applicationType');
  if (applicationBaseName.includes('_') && (applicationType === UAA || applicationType === MICROSERVICE)) {
    throw new Error(
      "An application name can't contain underscores if the application is a microservice or a UAA application."
    );
  }
}

function checkLanguageOptions(jdlApplication) {
  const presentTranslationOption = jdlApplication.hasConfigurationOption('enableTranslation');
  if (presentTranslationOption) {
    const translationEnabled = jdlApplication.getConfigurationOptionValue('enableTranslation');
    const presentNativeLanguage = jdlApplication.hasConfigurationOption('nativeLanguage');
    if (translationEnabled && !presentNativeLanguage) {
      throw new Error('No chosen language.');
    }
  }
}

function checkForValidValues(jdlApplication, definitions) {
  const optionsToIgnore = [
    'baseName',
    'packageName',
    'packageFolder',
    'serverPort',
    'uaaBaseName',
    'blueprint',
    'jhiPrefix',
    'jwtSecretKey',
    'rememberMeKey',
    'languages',
    'nativeLanguage',
    'jhipsterVersion',
    'dtoSuffix',
    'entitySuffix',
    'otherModules',
    'creationTimestamp'
  ];
  jdlApplication.forEachConfigurationOption(option => {
    if (optionsToIgnore.includes(option.name)) {
      return;
    }
    checkForUnknownApplicationOption(definitions, option);
    checkForBooleanValue(definitions, option);
    checkSpecificOptions(definitions, option);
  });
}

function checkForUnknownApplicationOption(definitions, option) {
  if (!definitions.doesOptionExist(option.name)) {
    throw new Error(`Unknown application option '${option.name}'.`);
  }
}

function checkForBooleanValue(definitions, option) {
  if (definitions.getTypeForOption(option.name) === 'boolean' && typeof option.getValue() !== 'boolean') {
    throw new Error(`Expected a boolean value for option '${option.name}'`);
  }
}

function checkSpecificOptions(definitions, option) {
  switch (option.name) {
    case 'clientTheme':
    case 'clientThemeVariant':
      return;
    case 'testFrameworks':
      checkTestFrameworkValues(definitions, option.getValue());
      break;
    case 'databaseType':
      checkDatabaseTypeValue(definitions, option.getValue());
      break;
    case 'devDatabaseType':
      checkDevDatabaseTypeValue(definitions, option.getValue());
      break;
    case 'prodDatabaseType':
      checkProdDatabaseTypeValue(definitions, option.getValue());
      break;
    default:
      checkForUnknownValue(definitions, option);
  }
}

function checkTestFrameworkValues(jdlApplication, values) {
  if (Object.keys(values).length === 0) {
    return;
  }
  values.forEach(value => {
    if (!jdlApplication.doesOptionValueExist('testFrameworks', value)) {
      throw new Error(`Unknown value '${value}' for option 'testFrameworks'.`);
    }
  });
}

function checkDatabaseTypeValue(jdlApplication, value) {
  if (!jdlApplication.doesOptionValueExist('databaseType', value)) {
    throw new Error(`Unknown value '${value}' for option 'databaseType'.`);
  }
}

function checkDevDatabaseTypeValue(jdlApplication, value) {
  if (
    !jdlApplication.doesOptionValueExist('databaseType', value) &&
    !jdlApplication.doesOptionValueExist('devDatabaseType', value) &&
    !jdlApplication.doesOptionValueExist('prodDatabaseType', value)
  ) {
    throw new Error(`Unknown value '${value}' for option 'devDatabaseType'.`);
  }
}

function checkProdDatabaseTypeValue(jdlApplication, value) {
  if (
    !jdlApplication.doesOptionValueExist('databaseType', value) &&
    !jdlApplication.doesOptionValueExist('prodDatabaseType', value)
  ) {
    throw new Error(`Unknown value '${value}' for option 'prodDatabaseType'.`);
  }
}

function checkForUnknownValue(definitions, option) {
  const optionType = definitions.getTypeForOption(option.name);
  if (optionType !== 'boolean' && !definitions.doesOptionValueExist(option.name, option.getValue())) {
    throw new Error(`Unknown option value '${option.getValue()}' for option '${option.name}'.`);
  }
}

function checkForInvalidDatabaseCombinations(jdlApplication, definitions) {
  const databaseType = jdlApplication.getConfigurationOptionValue('databaseType');
  const devDatabaseType = jdlApplication.getConfigurationOptionValue('devDatabaseType');
  const prodDatabaseType = jdlApplication.getConfigurationOptionValue('prodDatabaseType');
  const enabledHibernateCache = jdlApplication.getConfigurationOptionValue('enableHibernateCache');

  definitions.assertDatabasesAreAllowed(databaseType, prodDatabaseType, devDatabaseType, { enabledHibernateCache });
}

function checkApplicationOptions(jdlApplication) {
  if (jdlApplication.getOptionQuantity() === 0) {
    return;
  }
  const unaryOptionValidator = new UnaryOptionValidator();
  const binaryOptionValidator = new BinaryOptionValidator();
  jdlApplication.forEachOption(option => {
    if (option.getType() === 'UNARY') {
      unaryOptionValidator.validate(option);
    } else {
      binaryOptionValidator.validate(option);
    }
    checkForPaginationInAppWithCassandra(option, jdlApplication);
  });
}

function checkForPaginationInAppWithCassandra(jdlOption, jdlApplication) {
  if (
    jdlApplication.getConfigurationOptionValue('databaseType') === CASSANDRA &&
    jdlOption.name === Options.PAGINATION
  ) {
    throw new Error("Pagination isn't allowed when the app uses Cassandra.");
  }
}
