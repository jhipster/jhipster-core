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
 *      http://www.apache.org/licenses/LICENSE-2.0 = 0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const JCoreDefinitions = require('./jhipster');

module.exports = class JDLApplicationConfiguration {
  constructor(config = {}, definitions = new JCoreDefinitions()) {
    this.options = {};
    this.definitions = definitions;
  }

  hasOption(optionName) {
    if (!optionName) {
      return false;
    }
    return optionName in this.options;
  }

  getOption(optionName) {
    if (!optionName) {
      throw new Error('An option name has to be passed to get the option.');
    }
    if (!(optionName in this.options)) {
      return undefined;
    }
    return this.options[optionName];
  }

  setOption(option) {
    if (!option) {
      throw new Error('An option has to be passed to set an option.');
    }
    this.options[option.name] = option;
  }

  forEachOption(passedFunction) {
    if (!passedFunction) {
      return;
    }
    Object.values(this.options).forEach(option => {
      passedFunction(option);
    });
  }

  toString(indent = 0) {
    const spaceBeforeConfigKeyword = ' '.repeat(indent);
    if (Object.keys(this.options).length === 0) {
      return `${spaceBeforeConfigKeyword}config {}`;
    }
    const spaceBeforeOption = ' '.repeat(2 * indent);
    const config = getFormattedConfigOptionsString(this.options, spaceBeforeOption, this.definitions);
    return `${spaceBeforeConfigKeyword}config {
${config}
${spaceBeforeConfigKeyword}}`;
  }
};

function getFormattedConfigOptionsString(options, indent, definitions) {
  return Object.keys(options)
    .sort()
    .map(optionName => {
      return options[optionName];
    })
    .filter(option => definitions.shouldOptionBeExported(option))
    .map(option => {
      return `${indent}${option}`;
    })
    .join('\n');
}
