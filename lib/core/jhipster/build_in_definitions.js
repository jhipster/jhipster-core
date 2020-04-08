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

const { OptionTypes_, OptionNames, QuotedOptionNames, OptionValues } = require('./application_options');
const databaseTypes = require('./database_types');

const supportedDatabases = { ...databaseTypes };

delete supportedDatabases.isSql;

const sqlDatabases = [
  supportedDatabases.SQL,
  supportedDatabases.MYSQL,
  supportedDatabases.POSTGRESQL,
  supportedDatabases.MARIADB,
  supportedDatabases.ORACLE,
  supportedDatabases.MSSQL
];

const cannotMixProdDev = [
  supportedDatabases.MONGODB,
  supportedDatabases.COUCHBASE,
  supportedDatabases.CASSANDRA,
  supportedDatabases.NEO4J
];

const prodSqlDatabases = [
  supportedDatabases.MYSQL,
  supportedDatabases.POSTGRESQL,
  supportedDatabases.MARIADB,
  supportedDatabases.ORACLE,
  supportedDatabases.MSSQL
];

const databases = { no: {} };

sqlDatabases.forEach(type => {
  databases[type] = databases[type] || {};
  databases[type].sql = true;
});

cannotMixProdDev.forEach(type => {
  databases[type] = databases[type] || {};
  databases[type].cannotMixProdDev = true;
});

prodSqlDatabases.forEach(type => {
  databases[type] = databases[type] || {};
  databases[type].sql = true;
  databases[type].prod = true;
});

[OptionValues[OptionNames.DEV_DATABASE_TYPE].h2Memory, OptionValues[OptionNames.DEV_DATABASE_TYPE].h2Disk].forEach(
  type => {
    databases[type] = databases[type] || {};
    databases[type].sql = true;
    databases[type].devOnly = true;
  }
);

const applicationOptions = {};

const getOrCreateDefinition = optionName => {
  const optionDefinition = (applicationOptions[optionName] = applicationOptions[optionName] || {});
  optionDefinition.label = optionName;
  return optionDefinition;
};

const getOrCreateJDLDefinition = optionName => {
  const optionDefinition = getOrCreateDefinition(optionName);
  const jdlDefinition = (optionDefinition.jdl = optionDefinition.jdl || {});
  return jdlDefinition;
};

Object.entries(OptionNames).forEach(([_optionIdentifier, optionName]) => {
  getOrCreateDefinition(optionName);
});

Object.entries(OptionTypes_).forEach(([optionName, optionType]) => {
  getOrCreateDefinition(optionName).type = optionType.type;
});

Object.entries(OptionValues).forEach(([optionName, optionValues]) => {
  getOrCreateDefinition(optionName).values = optionValues;
});

QuotedOptionNames.forEach(optionName => {
  getOrCreateJDLDefinition(optionName).quoted = true;
});

[OptionNames.ENTITY_SUFFIX, OptionNames.DTO_SUFFIX, OptionNames.CLIENT_THEME_VARIANT].forEach(optionName => {
  getOrCreateJDLDefinition(optionName).omitOnNegativeValue = true;
});

[OptionNames.PACKAGE_FOLDER, OptionNames.BLUEPRINTS].forEach(optionName => {
  getOrCreateJDLDefinition(optionName).alwaysOmit = true;
});

module.exports = {
  applicationOptions,
  databases
};
