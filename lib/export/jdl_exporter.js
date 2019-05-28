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
const Options = require('../core/jhipster/application_options');

module.exports = {
  exportToJDL,
  convertApplicationToString
};

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

const excludeOptions = ['jhipsterVersion', 'packageFolder', 'otherModules'];

function optionsExists(key) {
  return !excludeOptions.includes(key) && Options.exists(key);
}

function filterApplicationOptions(application) {
  const filteredApp = {};
  Object.keys(application).forEach(key => {
    if (optionsExists(key)) {
      filteredApp[key] = application[key];
      if (key === 'entitySuffix' || key === 'dtoSuffix') {
        if (filteredApp[key] === '') filteredApp[key] = false;
      } else if (key === 'languages' || key === 'testFrameworks') {
        filteredApp[key] = `[${filteredApp[key].toString()}]`;
      }
    }
  });
  return filteredApp;
}

function convertApplicationToString(application) {
  const filtered = filterApplicationOptions(application);
  let output = 'application {\n  config {\n';
  Object.keys(filtered).forEach(key => {
    output += `    ${key} ${filtered[key].toString()}\n`;
  });
  output += '  }\n}';
  return output;
}
