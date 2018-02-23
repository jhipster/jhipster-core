/**
 * Copyright 2013-2018 the original author or authors from the JHipster project.
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

const Set = require('../../utils/objects/set');
const _ = require('lodash');
const Validations = require('./validations').VALIDATIONS;
const JDLEnum = require('../jdl_enum');
const DatabaseTypes = require('./database_types').Types;
const BuildException = require('../../exceptions/exception_factory').BuildException;
const exceptions = require('../../exceptions/exception_factory').exceptions;

const CommonDBTypes = {
  STRING: 'String',
  INTEGER: 'Integer',
  LONG: 'Long',
  BIG_DECIMAL: 'BigDecimal',
  FLOAT: 'Float',
  DOUBLE: 'Double',
  ENUM: 'Enum',
  BOOLEAN: 'Boolean',
  LOCAL_DATE: 'LocalDate',
  ZONED_DATE_TIME: 'ZonedDateTime',
  BLOB: 'Blob',
  ANY_BLOB: 'AnyBlob',
  IMAGE_BLOB: 'ImageBlob',
  TEXT_BLOB: 'TextBlob',
  INSTANT: 'Instant'
};

const CommonDBValidations = {
  String: new Set([Validations.REQUIRED, Validations.MINLENGTH, Validations.MAXLENGTH, Validations.PATTERN]),
  Integer: new Set([Validations.REQUIRED, Validations.MIN, Validations.MAX]),
  Long: new Set([Validations.REQUIRED, Validations.MIN, Validations.MAX]),
  BigDecimal: new Set([Validations.REQUIRED, Validations.MIN, Validations.MAX]),
  Float: new Set([Validations.REQUIRED, Validations.MIN, Validations.MAX]),
  Double: new Set([Validations.REQUIRED, Validations.MIN, Validations.MAX]),
  Enum: new Set([Validations.REQUIRED]),
  Boolean: new Set([Validations.REQUIRED]),
  LocalDate: new Set([Validations.REQUIRED]),
  ZonedDateTime: new Set([Validations.REQUIRED]),
  Blob: new Set([Validations.REQUIRED, Validations.MINBYTES, Validations.MAXBYTES]),
  AnyBlob: new Set([Validations.REQUIRED, Validations.MINBYTES, Validations.MAXBYTES]),
  ImageBlob: new Set([Validations.REQUIRED, Validations.MINBYTES, Validations.MAXBYTES]),
  TextBlob: new Set([Validations.REQUIRED, Validations.MINBYTES, Validations.MAXBYTES]),
  Instant: new Set([Validations.REQUIRED])
};

const CassandraTypes = {
  STRING: 'String',
  INTEGER: 'Integer',
  LONG: 'Long',
  BIG_DECIMAL: 'BigDecimal',
  FLOAT: 'Float',
  DOUBLE: 'Double',
  BOOLEAN: 'Boolean',
  DATE: 'Date',
  UUID: 'UUID',
  INSTANT: 'Instant'
};

const CassandraValidations = {
  String: new Set([Validations.REQUIRED, Validations.MINLENGTH, Validations.MAXLENGTH, Validations.PATTERN]),
  Integer: new Set([Validations.REQUIRED, Validations.MIN, Validations.MAX]),
  Long: new Set([Validations.REQUIRED, Validations.MIN, Validations.MAX]),
  BigDecimal: new Set([Validations.REQUIRED, Validations.MIN, Validations.MAX]),
  Float: new Set([Validations.REQUIRED, Validations.MIN, Validations.MAX]),
  Double: new Set([Validations.REQUIRED, Validations.MIN, Validations.MAX]),
  Boolean: new Set([Validations.REQUIRED]),
  Date: new Set([Validations.REQUIRED]),
  UUID: new Set([Validations.REQUIRED]),
  Instant: new Set([Validations.REQUIRED])
};

function isCommonDBType(type) {
  if (!type) {
    throw new BuildException(exceptions.NullPointer, 'The passed type must not be nil.');
  }
  return (_.snakeCase(type).toUpperCase() in CommonDBTypes) || type instanceof JDLEnum;
}

function isCassandraType(type) {
  if (!type) {
    throw new BuildException(exceptions.NullPointer, 'The passed type must not be nil.');
  }
  return (_.snakeCase(type).toUpperCase() in CassandraTypes) && !(type instanceof JDLEnum);
}

function hasValidation(type, validation, isAnEnum) {
  if (!type || !validation) {
    throw new BuildException(exceptions.NullPointer, 'The passed type and value must not be nil.');
  }
  if (isAnEnum) {
    type = 'Enum';
  }
  return (isCommonDBType(type) && CommonDBValidations[type].has(validation))
    || (isCassandraType(type) && CassandraValidations[type].has(validation));
}

function getIsType(databaseType, callback) {
  if (!databaseType) {
    throw new BuildException(exceptions.NullPointer, 'The passed type must not be nil.');
  }
  let isType;
  switch (databaseType) {
  case DatabaseTypes.sql:
  case DatabaseTypes.mysql:
  case DatabaseTypes.mariadb:
  case DatabaseTypes.postgresql:
  case DatabaseTypes.oracle:
  case DatabaseTypes.mssql:
  case DatabaseTypes.mongodb:
  case DatabaseTypes.couchbase:
    isType = isCommonDBType;
    break;
  case DatabaseTypes.cassandra:
    isType = isCassandraType;
    break;
  default:
    callback && callback();
    throw new BuildException(
      exceptions.IllegalArgument,
      'The passed database type must either be \'sql\', \'mysql\', \'mariadb\', \'postgresql\', \'oracle\', \'mssql\', \'mongodb\', \'couchbase\', or \'cassandra\'');
  }
  return isType;
}

module.exports = {
  COMMON_DB_TYPES: CommonDBTypes,
  CommonDBTypes,
  CASSANDRA_TYPES: CassandraTypes,
  CassandraTypes,
  isCommonDBType,
  isCassandraType,
  hasValidation,
  getIsType
};
