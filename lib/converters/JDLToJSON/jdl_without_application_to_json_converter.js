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
const logger = require('../../utils/objects/logger');
const JSONEntity = require('../../core/jhipster/json_entity');
const { getTableNameFromEntityName } = require('../../core/jhipster/entity_table_name_creator');
const RelationshipConverter = require('./jdl_to_json_relationship_converter');
const { camelCase } = require('../../utils/string_utils');
const { formatComment } = require('../../utils/format_utils');
const { formatDateForLiquibase } = require('../../utils/format_utils');
const {
  FILTER,
  NO_FLUENT_METHOD,
  READ_ONLY,
  EMBEDDED,
  SKIP_CLIENT,
  SKIP_SERVER
} = require('../../core/jhipster/unary_options');
const { UNIQUE, REQUIRED } = require('../../core/jhipster/validations');
const BinaryOptions = require('../../core/jhipster/binary_options');

const {
  Options: { ANGULAR_SUFFIX, MICROSERVICE, SEARCH, DTO }
} = BinaryOptions;
const serviceClassOptionValue = BinaryOptions.Values.service.SERVICE_CLASS;

const USER = 'user';
const AUTHORITY = 'authority';
const builtInEntities = new Set([USER, AUTHORITY]);

let entities;
let jdlObject;

module.exports = {
  convert
};

/**
 * Converts a JDLObject to ready-to-be exported JSON entities.
 * @param {Object} args - the configuration object, keys:
 * @param {JDLObject} args.jdlObject - the JDLObject to convert to JSON
 * @param {String} args.applicationName - the application's name
 * @param {String} args.databaseType - the database type
 * @param {applicationType} args.applicationType - the application's type
 * @param {Date} args.creationTimestamp - the creation timestamp, for entities
 * @returns {Map} entities that can be exported to JSON
 */
function convert(args = {}) {
  if (!args.jdlObject || !args.applicationName || !args.databaseType) {
    throw new Error("The JDL object, the application's name and its the database type are mandatory.");
  }
  init(args);
  initializeEntities(args.creationTimestamp);
  setOptions();
  fillEntities();
  setRelationships();
  setApplicationToEntities();
  return new Map([[args.applicationName, Object.values(entities)]]);
}

function init(args) {
  if (jdlObject) {
    resetState();
  }
  jdlObject = args.jdlObject;
  entities = {};
}

function resetState() {
  jdlObject = null;
  entities = null;
}

function initializeEntities(creationTimestamp = new Date()) {
  jdlObject.forEachEntity((jdlEntity, index) => {
    const entityName = jdlEntity.name;
    /*
     * If the user adds a 'User' entity we consider it as the already
     * created JHipster User entity and none of its fields and owner-side
     * relationships will be considered.
     */
    if (builtInEntities.has(entityName.toLowerCase())) {
      logger.warn(
        `An Entity name '${entityName}' was used: '${entityName}' is an entity created by default by JHipster.` +
          ' All relationships toward it will be kept but any attributes and relationships from it will be disregarded.'
      );
      return;
    }
    entities[entityName] = new JSONEntity({
      entityName,
      entityTableName: getTableNameFromEntityName(jdlEntity.tableName),
      changelogDate: formatDateForLiquibase({ date: new Date(creationTimestamp), increment: index + 1 }),
      javadoc: formatComment(jdlEntity.comment)
    });
  });
}

function setOptions() {
  jdlObject.forEachOption(jdlOption => {
    if (jdlOption.entityNames.size === 1 && jdlOption.entityNames.has('*')) {
      jdlOption.setEntityNames(
        jdlObject
          .getEntityNames()
          .filter(entityName => !jdlOption.excludedNames.has(entityName) && entityName.toLowerCase() !== USER)
      );
    }
    setEntityNamesOptions(jdlOption);
  });
}

function setEntityNamesOptions(jdlOption) {
  const { key, value } = getJSONOptionKeyAndValue(jdlOption);

  jdlOption.entityNames.forEach(entityName => {
    entities[entityName][key] = value;
  });
  jdlOption.entityNames.forEach(entityName => {
    if (entities[entityName].service === 'no' && [DTO, FILTER].includes(jdlOption.name)) {
      logger.info(
        `The ${jdlOption.name} option is set for ${entityName}, the '${serviceClassOptionValue}' value for the ` +
          "'service' is gonna be set for this entity if no other value has been set."
      );
      entities[entityName].service = serviceClassOptionValue;
    }
  });

  if (jdlOption.name === SEARCH) {
    preventEntitiesFromBeingSearched(jdlOption.excludedNames);
  }
}

function getJSONOptionKeyAndValue(jdlOption) {
  switch (jdlOption.name) {
    case SKIP_CLIENT:
    case SKIP_SERVER:
    case READ_ONLY:
    case EMBEDDED:
      return { key: jdlOption.name, value: true };
    case DTO:
      return { key: jdlOption.name, value: jdlOption.value };
    case MICROSERVICE:
      return { key: 'microserviceName', value: jdlOption.value };
    case NO_FLUENT_METHOD:
      return { key: 'fluentMethods', value: false };
    case ANGULAR_SUFFIX:
      return { key: 'angularJSSuffix', value: jdlOption.value };
    case SEARCH:
      return { key: 'searchEngine', value: jdlOption.value };
    case FILTER:
      return { key: 'jpaMetamodelFiltering', value: true };
    default:
      return { key: jdlOption.name, value: jdlOption.value || true };
  }
}

function preventEntitiesFromBeingSearched(entityNames) {
  entityNames.forEach(entityName => {
    entities[entityName].searchEngine = false;
  });
}

function fillEntities() {
  jdlObject.forEachEntity(entity => {
    if (entity.name.toLowerCase() !== USER) {
      setFieldsOfEntity(entity.name);
      // setRelationshipOfEntity(entity.name);
    }
  });
}

function setFieldsOfEntity(entityName) {
  jdlObject.getEntity(entityName).forEachField(jdlField => {
    const fieldData = {
      fieldName: camelCase(jdlField.name)
    };
    const comment = formatComment(jdlField.comment);
    if (comment) {
      fieldData.javadoc = comment;
    }
    fieldData.fieldType = jdlField.type;
    if (jdlObject.getEnum(jdlField.type)) {
      fieldData.fieldType = jdlField.type;
      fieldData.fieldValues = jdlObject.getEnum(jdlField.type).getValuesAsString();
    }
    if (fieldData.fieldType && fieldData.fieldType.includes('Blob')) {
      setBlobFieldData(fieldData);
    }
    setValidationsOfField(jdlField, fieldData);
    setOptionsForField(jdlField, fieldData);
    entities[entityName].addField(fieldData);
  });
}

function setBlobFieldData(fieldData) {
  switch (fieldData.fieldType) {
    case 'ImageBlob':
      fieldData.fieldTypeBlobContent = 'image';
      break;
    case 'Blob':
    case 'AnyBlob':
      fieldData.fieldTypeBlobContent = 'any';
      break;
    case 'TextBlob':
      fieldData.fieldTypeBlobContent = 'text';
      break;
    default:
  }
  fieldData.fieldType = 'byte[]';
}

function setValidationsOfField(jdlField, fieldData) {
  if (jdlField.validationQuantity() === 0) {
    return;
  }
  fieldData.fieldValidateRules = [];
  jdlField.forEachValidation(validation => {
    fieldData.fieldValidateRules.push(validation.name);
    if (validation.name !== REQUIRED && validation.name !== UNIQUE) {
      fieldData[`fieldValidateRules${_.capitalize(validation.name)}`] = validation.value;
    }
  });
}

function setOptionsForField(jdlField, fieldData) {
  if (jdlField.optionQuantity() === 0) {
    return;
  }
  fieldData.options = {};
  jdlField.forEachOption(([key, value]) => {
    fieldData.options[key] = value;
  });
}

function setRelationships() {
  const relationships = RelationshipConverter.convert(jdlObject.getRelationships(), jdlObject.getEntityNames());
  relationships.forEach((relationships, entityName) => {
    if (builtInEntities.has(entityName.toLowerCase())) {
      return;
    }
    relationships.forEach(relationship => {
      entities[entityName].addRelationship(relationship);
    });
  });
}

function setApplicationToEntities() {
  Object.keys(entities).forEach(entityName => {
    entities[entityName].applications = '*';
  });
}
