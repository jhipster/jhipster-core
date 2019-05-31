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

const fs = require('fs');
const path = require('path');
const applicationOptions = require('../core/jhipster/application_options');
const unaryOptions = require('../core/jhipster/unary_options');
const JSONFileReader = require('../reader/json_file_reader');
const JSONReader = require('../reader/json_reader');
const JSONToJdlApplicationConverter = require('../converters/json_to_jdl_application_converter');
const FileUtils = require('../utils/file_utils');
const JDLObject = require('../core/jdl_object');

module.exports = {
  exportToJDL,
  loadJhipsterConfigAndEntities
};

const excludeUnaryOptions = ['skipUserManagement'];

/**
 * Indicate if an unary option should be written in the jdl file
 * @param key
 */
function unaryOptionsExists(key) {
  return !excludeUnaryOptions.includes(key) && unaryOptions.exists(key);
}

const excludeOptions = ['jhipsterVersion', 'packageFolder', 'otherModules'];

/**
 * Indicate if an application option should be written in the jdl file
 * @param key option name
 */
function applicationOptionsExists(key) {
  return !excludeOptions.includes(key) && applicationOptions.exists(key);
}

/**
 * Remove unwanted application options for the jdl file
 * @param application the application
 */
function filterApplicationOptions(application) {
  if (application.config === undefined) {
    throw new Error(`'${application.toString()}' must contain config field.`);
  }
  const config = application.config;
  Object.keys(config).forEach(key => {
    if (!applicationOptionsExists(key)) {
      delete config[key];
    } else if ((key === 'entitySuffix' || key === 'dtoSuffix') && config[key] === '') {
      config[key] = false;
    }
  });
  return application;
}

/**
 * load the application configuration and the associated entities from a Jhipster project
 * contained in a folder
 * @param dir path to the directory where it should contains the .yo-rc.json
 */
function loadApplicationAndEntities(dir) {
  if (!dir) {
    dir = '.';
  }

  if (!FileUtils.doesFileExist(path.join(dir, '.yo-rc.json'))) {
    throw new Error('The directory does not contain a .yo-rc.json');
  }
  const jsonapplication = JSONFileReader.readEntityJSON(path.join(dir, '.yo-rc.json'));
  let jdlapplication = JSONToJdlApplicationConverter.convertApplicationsToJDL({
    applications: [jsonapplication]
  }).applications;
  jdlapplication = jdlapplication[Object.keys(jdlapplication)[0]];
  let jdlentities = new JDLObject();

  if (FileUtils.doesDirectoryExist(path.join(dir, '.jhipster'))) {
    jdlentities = JSONReader.parseFromDir(dir);
  }

  addEntitiesToJdlApplication(jdlentities, jdlapplication);
  filterApplicationOptions(jdlapplication);
  return {
    JDLApplication: jdlapplication,
    JDLEntities: jdlentities
  };
}

/**
 * Add the entity names used by the application
 * @param entitiesjdl entities
 * @param applicationjdl application
 */
function addEntitiesToJdlApplication(entitiesjdl, applicationjdl) {
  const entities = entitiesjdl.entities;
  const entitynames = new Set();
  Object.keys(entities).forEach(key => {
    entitynames.add(entities[key].name);
  });
  applicationjdl.entityNames = entitynames;
  return applicationjdl;
}

/**
 * load a jhipster configuration with the entities into a JDLObject
 * @param dir root folder
 */
function loadJhipsterConfigAndEntities(dir) {
  const jdl = new JDLObject();
  const apps = [];

  if (FileUtils.doesFileExist(path.join(dir, '.yo-rc.json'))) {
    apps.push(loadApplicationAndEntities(dir));
  } else {
    listYoRcDirectories(dir).forEach(subdir => apps.push(loadApplicationAndEntities(path.join(dir, subdir))));
    if (apps.length === 0) {
      throw new Error('The directory does not contain a .yo-rc.json nor any of sub folders (depth 1)');
    }
  }

  apps.forEach(app => {
    jdl.addApplication(app.JDLApplication);
    app.JDLEntities.forEachEntity(entity => {
      jdl.addEntity(entity);
    });
    app.JDLEntities.enums.forEach(jdlenum => {
      jdl.addEnum(jdlenum);
    });
    app.JDLEntities.relationships.forEach(jdlrelationship => {
      jdl.addRelationship(jdlrelationship);
    });
    app.JDLEntities.getOptions().forEach(jdloption => {
      if (!(jdloption.getType() === 'UNARY') || unaryOptionsExists(jdloption.name)) {
        jdl.addOption(jdloption);
      }
    });
  });

  return jdl;
}

/**
 * List sub directories which contains a .yo-rc.json file
 * @param dir directory to search
 */
function listYoRcDirectories(dir) {
  return fs
    .readdirSync(dir)
    .filter(content => fs.statSync(path.join(dir, content)).isDirectory())
    .filter(sdir => FileUtils.doesFileExist(path.join(dir, sdir, '.yo-rc.json')));
}

/**
 * Writes down the given JDL to a file.
 * @param jdl the JDL to write.
 * @param path the path where the file will be written.
 */
function exportToJDL(jdl, path) {
  if (!jdl) {
    throw new Error('A JDLObject has to be passed to be exported.');
  }
  if (!path) {
    path = './jhipster-jdl.jh';
  }
  fs.writeFileSync(path, jdl.toString());
}
