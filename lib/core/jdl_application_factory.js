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

const ApplicationTypes = require('./jhipster/application_types');
const {
  getDefaultConfigForNewApplication,
  getConfigForMonolithApplication,
  getConfigForGatewayApplication,
  getConfigForMicroserviceApplication,
  getConfigForUAAApplication
} = require('./jhipster/default_application_options');
const JDLApplication = require('./jdl_application');

module.exports = {
  createJDLApplication
};

/**
 * Creates a JDL application from a passed configuration.
 * @param {Object} config - the application configuration.
 * @param {JCoreDefinitions} definitions - the aplication definitions.
 * @returns {JDLApplication} the created JDL application.
 */
function createJDLApplication(config = {}, definitions) {
  const baseConfig = getDefaultConfigForNewApplication(config);
  let appConfig;
  switch (config.applicationType) {
    case ApplicationTypes.MICROSERVICE:
      appConfig = getConfigForMicroserviceApplication(baseConfig);
      break;
    case ApplicationTypes.GATEWAY:
      appConfig = getConfigForGatewayApplication(baseConfig);
      break;
    case ApplicationTypes.UAA:
      appConfig = getConfigForUAAApplication(baseConfig);
      break;
    case ApplicationTypes.MONOLITH:
    default:
      appConfig = getConfigForMonolithApplication(baseConfig);
  }
  return new JDLApplication({ config: appConfig, definitions });
}
