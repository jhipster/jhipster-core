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

/* eslint-disable no-new, no-unused-expressions */
const { expect } = require('chai');
const GenericJDLApplicationConfigurationOption = require('../../../lib/core/generic_jdl_application_configuration_option');

describe('GenericJDLApplicationConfigurationOption', () => {
  describe('toString', () => {
    context('when passing string', () => {
      let jdlConfigurationOption;
      before(() => {
        jdlConfigurationOption = new GenericJDLApplicationConfigurationOption('foo', 'bar');
      });
      it('should return', () => {
        expect(jdlConfigurationOption.toString()).to.be.equal('foo bar');
      });
    });

    context('when passing value and quote option', () => {
      let jdlConfigurationOption;

      before(() => {
        jdlConfigurationOption = new GenericJDLApplicationConfigurationOption('foo', '.bar', true);
      });
      it('should add quotes', () => {
        expect(jdlConfigurationOption.toString()).to.be.equal('foo ".bar"');
      });
    });

    context('when passing array', () => {
      let jdlConfigurationOption;

      before(() => {
        jdlConfigurationOption = new GenericJDLApplicationConfigurationOption('foo', ['bar']);
      });
      it('should add brackets', () => {
        expect(jdlConfigurationOption.toString()).to.be.equal('foo [bar]');
      });
    });
  });
});
