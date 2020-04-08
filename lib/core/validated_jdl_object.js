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

const ApplicationValidator = require('../validators/application_validator');
const EntityValidator = require('../validators/entity_validator');
const DeploymentValidator = require('../validators/deployment_validator');
const UnaryOptionValidator = require('../validators/unary_option_validator');
const BinaryOptionValidator = require('../validators/binary_option_validator');
const EnumValidator = require('../validators/enum_validator');
const RelationshipValidator = require('../validators/relationship_validator');
const ValidatedJDLOptions = require('./validated_jdl_options');
const JDLObject = require('./jdl_object');

/**
 * The JDL object class, containing applications, entities etc.
 * @deprecated
 */
class ValidatedJDLObject extends JDLObject {
  constructor(options = {}) {
    super();
    const { deferValidation, skippedUserManagement } = options;
    this.skippedUserManagement = skippedUserManagement;
    this.deferValidation = deferValidation;
    this.options = new ValidatedJDLOptions(deferValidation);
    this.applicationValidator = new ApplicationValidator();
    this.entityValidator = new EntityValidator();
    this.deploymentValidator = new DeploymentValidator();
    this.unaryOptionValidator = new UnaryOptionValidator();
    this.binaryOptionValidator = new BinaryOptionValidator();
    this.enumValidator = new EnumValidator();
    this.relationshipValidator = new RelationshipValidator();
  }

  validate() {
    this.forEachApplication(application => {
      this.applicationValidator.validate(application);
    });
    this.forEachDeployment(deployment => {
      this.deploymentValidator.validate(deployment);
    });
    this.forEachEntity(entity => {
      this.entityValidator.validate(entity);
    });
    this.forEachEnum(enumToValidate => {
      this.enumValidator.validate(enumToValidate);
    });
    this.forEachRelationship(relationship => {
      this.relationshipValidator.validate(relationship, this.skippedUserManagement);
    });
    this.options.validate();
  }

  /**
   * Adds or replaces an application.
   * @param application the application.
   */
  addApplication(application) {
    if (!application) {
      throw new Error("Can't add invalid application. Error: No application.");
    }
    try {
      !this.deferValidation && this.applicationValidator.validate(application);
    } catch (error) {
      throw new Error(`Can't add invalid application. ${error}`);
    }
    super.addApplication(application);
  }

  /**
   * Adds or replaces a deployment.
   * @param deployment the deployment.
   */
  addDeployment(deployment) {
    try {
      !this.deferValidation && this.deploymentValidator.validate(deployment);
    } catch (error) {
      throw new Error(`Can't add invalid deployment. ${error}`);
    }
    super.addDeployment(deployment);
  }

  /**
   * Adds or replaces an entity.
   * @param entity the entity to add.
   */
  addEntity(entity) {
    try {
      !this.deferValidation && this.entityValidator.validate(entity);
    } catch (error) {
      throw new Error(`Can't add invalid entity. ${error}`);
    }
    super.addEntity(entity);
  }

  /**
   * Adds or replaces an enum.
   * @param enumToAdd the enum to add.
   */
  addEnum(enumToAdd) {
    try {
      !this.deferValidation && this.enumValidator.validate(enumToAdd);
    } catch (error) {
      throw new Error(`Can't add invalid enum. ${error}`);
    }
    super.addEnum(enumToAdd);
  }

  addRelationship(relationship, skippedUserManagement) {
    try {
      !this.deferValidation && this.relationshipValidator.validate(relationship, skippedUserManagement);
    } catch (error) {
      throw new Error(`Can't add invalid relationship. ${error}`);
    }
    super.addRelationship(relationship);
  }

  addOption(option) {
    if (!option || !option.getType) {
      throw new Error("Can't add nil option.");
    }
    try {
      super.addOption(option);
    } catch (error) {
      throw new Error(`Can't add invalid option. ${error}`);
    }
  }
}

module.exports = ValidatedJDLObject;
