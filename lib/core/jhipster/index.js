/**
 * Copyright 2013-2020 the original author or authors from the JHipster project.
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

const _ = require('lodash');
const BUILD_IN_DEFINITIONS = require('./build_in_definitions');
const logger = require('../../utils/objects/logger');
const { SQL } = require('./database_types');

const DEFINITION_STRUCTURE = {
  applicationOptions: {},
  databases: {}
};

class JCoreDefinitions {
  static get DEFINITIONS() {
    return _.cloneDeep(BUILD_IN_DEFINITIONS);
  }

  constructor(definitions = JCoreDefinitions.DEFINITIONS) {
    this._definitions = _.merge({}, DEFINITION_STRUCTURE, definitions);
  }

  extendDefinitions(additionalDefinitions) {
    if (!Array.isArray(additionalDefinitions)) {
      additionalDefinitions = [additionalDefinitions];
    }
    _.merge(this._definitions, ...additionalDefinitions);
  }

  /**
   * Returns the option's type, one of string, boolean, list or integer.
   * @param {String} optionName - the option's name.
   * @returns {String} the option's type.
   */
  getTypeForOption(optionName) {
    if (!optionName) {
      throw new Error('A name has to be passed to get the option type.');
    }
    const optionSpec = this._definitions.applicationOptions[optionName];
    if (!optionSpec) {
      throw new Error(`Unrecognised application option name: ${optionName}.`);
    }
    return optionSpec.type;
  }

  /**
   * Checks whether the option value exists for the passed option name.
   * @param {String} name - the option name.
   * @param {String|Boolean|Number|Array} value - the option value.
   * @returns {Boolean} whether the option value exists for the name.
   */
  doesOptionValueExist(optionName, value) {
    if (!this.doesOptionExist(optionName)) {
      return false;
    }
    const optionValues = this._definitions.applicationOptions[optionName].values;
    return optionValues && optionValues[value] != null;
  }

  /**
   * Checks whether the option's exists.
   * @param {String} optionName - the option's name.
   * @returns {Boolean} the option's existence.
   */
  doesOptionExist(optionName) {
    return !!optionName && this._definitions.applicationOptions[optionName];
  }

  /**
   * Checks whether the option's should be exported to jdl.
   * @param {JDLApplicationConfigurationOption} optionName - the option's name.
   * @returns {Boolean|Undefined} the option's existence.
   */
  shouldOptionBeExported(option) {
    const shouldBeExported = this.doesOptionExist(option.getName(), option.getValue());
    if (!shouldBeExported) {
      logger.debug(`Unrecognized application option name and value: ${option.getName()} and ${option.getValue()}`);
      // Config is not contained at definitions.
      return undefined;
    }
    const optionSpec = this._definitions.applicationOptions[option.getName()];
    if (optionSpec.jdl && optionSpec.jdl.alwaysOmit) {
      return false;
    }
    if (optionSpec.jdl && optionSpec.jdl.omitOnNegativeValue && !option.getValue()) {
      return false;
    }
    return shouldBeExported;
  }

  shouldTheValueBeQuoted(optionName, value) {
    if (!optionName) {
      return false;
    }
    if (value !== undefined && !(value instanceof Set) && !/^[A-Za-z][A-Za-z0-9-_]*$/.test(`${value}`)) {
      return true;
    }
    const optionSpec = this._definitions.applicationOptions[optionName];
    return optionSpec && optionSpec.jdl && optionSpec.jdl.quoted;
  }

  /* DATABASE */
  databaseIsSql(type) {
    const databaseSpec = this._definitions.databases[type];
    return !!(databaseSpec && databaseSpec.sql);
  }

  _prodSqlDatabases() {
    return Object.entries(this._definitions.databases)
      .filter(([_name, spec]) => {
        return spec.prod;
      })
      .map(([name, _spec]) => name);
  }

  _cannotMixProdDevDatabases() {
    return Object.entries(this._definitions.databases)
      .filter(([_name, spec]) => {
        return spec.cannotMixProdDev;
      })
      .map(([name, _spec]) => name);
  }

  _devSqlDatabases() {
    return Object.entries(this._definitions.databases)
      .filter(([_name, spec]) => {
        return spec.devOnly;
      })
      .map(([name, _spec]) => name);
  }

  assertDatabasesAreAllowed(databaseType, prodDatabaseType, devDatabaseType, config = {}) {
    if (!databaseType && !prodDatabaseType && !devDatabaseType) {
      return;
    }
    const databaseTypeSpec = this._definitions.databases[databaseType];
    if (!databaseTypeSpec) {
      throw new Error(`Database type ${databaseType} is not supported`);
    }
    const prodDatabaseSpec = this._definitions.databases[prodDatabaseType];
    if (!prodDatabaseSpec) {
      throw new Error(`Prod database type ${prodDatabaseType} is not supported`);
    }
    const devDatabaseSpec = this._definitions.databases[devDatabaseType];
    if (!devDatabaseSpec) {
      throw new Error(`Dev database type ${devDatabaseType} is not supported`);
    }
    if (databaseType === SQL) {
      if (!prodDatabaseSpec.prod) {
        throw new Error(
          `Only ${formatValueList(
            this._prodSqlDatabases()
          )} are allowed as prodDatabaseType values for databaseType 'sql'.`
        );
      }
      if (prodDatabaseType !== devDatabaseType && !devDatabaseSpec.devOnly) {
        throw new Error(
          `Database '${devDatabaseType}' is not allowed as dev database for '${prodDatabaseType}'. Only ${formatValueList(
            this._devSqlDatabases(prodDatabaseType).concat([prodDatabaseType])
          )} are allowed as devDatabaseType values.`
        );
      }
      if (!devDatabaseSpec.sql || !prodDatabaseSpec.sql) {
        throw new Error(
          `Both 'prodDatabaseType=${prodDatabaseType}' and 'devDatabaseType=${devDatabaseType}' must be sql.`
        );
      }
      return;
    }
    if (databaseTypeSpec.cannotMixProdDev) {
      if (databaseType !== devDatabaseType || databaseType !== prodDatabaseType) {
        throw new Error(
          `When the databaseType is either ${formatValueList(
            this._cannotMixProdDevDatabases()
          )}, the devDatabaseType and prodDatabaseType must be the same.`
        );
      }
      if (config.enabledHibernateCache) {
        throw new Error(
          `An application having ${databaseType} as database type can't have the hibernate cache enabled.`
        );
      }
    }
  }
}

function formatValueList(list) {
  return list.map(item => `'${item}'`).join(', ');
}

module.exports = JCoreDefinitions;
