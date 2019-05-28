/* eslint-disable */

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
const Options = require('../core/jhipster/application_options');
const JSONFileReader = require('../reader/json_file_reader');
const JSONReader = require('../reader/json_reader');
const JSONToJdlApplicationConverter = require('../converters/json_to_jdl_application_converter');

module.exports = {
  exportToJDL,
  loadJhipsterConfigAndEntities
};

const excludeOptions = ['jhipsterVersion', 'packageFolder', 'otherModules'];
function optionsExists(key) {
  return !excludeOptions.includes(key) && Options.exists(key);
}

function filterApplicationOptions(application) {
  if (application.config === undefined) {
    throw new Error(`'${application.toString()}' must contain config field.`);
  }
  const config = application.config;
  Object.keys(config).forEach(key => {
    if (!optionsExists(key)) {
      delete config[key];
    } else if ((key === 'entitySuffix' || key === 'dtoSuffix') && config[key] === '') {
      config[key] = false;
    }
  });
  return application;
}

function loadApplicationAndEntities(dir) {
  const jsonapplication = JSONFileReader.readEntityJSON(path.join(dir, '.yo-rc.json'));
  let jdlapplication = JSONToJdlApplicationConverter.convertApplicationsToJDL({
    applications: [jsonapplication]
  }).applications;
  jdlapplication = jdlapplication[Object.keys(jdlapplication)[0]];
  const jdlentities = JSONReader.parseFromDir(dir);
  addEntitiesToJdlApplication(jdlentities.entities, jdlapplication);
  filterApplicationOptions(jdlapplication);
  return {
    JDLApplication: jdlapplication,
    JDLEntities: jdlentities
  };
}

function addEntitiesToJdlApplication(entitiesjdl, applicationjdl) {
  const entities = new Set();
  Object.keys(entitiesjdl).forEach(key => {
    entities.add(entitiesjdl[key].name);
  });
  applicationjdl.entityNames = entities;
  return applicationjdl;
}

function loadJhipsterConfigAndEntities() {
  const app = loadApplicationAndEntities('.');

  return app.JDLApplication.toString()+"\n"+app.JDLEntities.toString();
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

