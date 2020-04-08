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
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
const { expect } = chai;

const fs = require('fs');
const JCoreDefinitions = require('../../../lib/core/jhipster');
const ValidatedJDLObject = require('../../../lib/core/validated_jdl_object');
const JDLObject = require('../../../lib/core/jdl_object');
const JDLApplication = require('../../../lib/core/jdl_application');
const JDLEntity = require('../../../lib/core/jdl_entity');
const JDLExporter = require('../../../lib/exporters/jdl_exporter');
const logger = require('../../../lib/utils/objects/logger');

describe('JDLExporter', () => {
  describe('exportToJDL', () => {
    context('when passing invalid parameters', () => {
      context('such as undefined', () => {
        it('should fail', () => {
          expect(() => {
            JDLExporter.exportToJDL();
          }).to.throw(/^A JDLObject has to be passed to be exported\.$/);
        });
      });
    });
    context('when passing valid parameters', () => {
      context('with a path', () => {
        const PATH = 'myPath.jdl';
        let fileExistence;
        let jdlContent = '';

        before(() => {
          const jdlObject = new ValidatedJDLObject();
          jdlObject.addEntity(
            new JDLEntity({
              name: 'Toto'
            })
          );
          JDLExporter.exportToJDL(jdlObject, PATH);
          fileExistence = fs.statSync(PATH).isFile();
          jdlContent = fs.readFileSync(PATH, 'utf-8').toString();
        });

        after(() => {
          fs.unlinkSync(PATH);
        });

        it('should export the JDL to the passed path', () => {
          expect(fileExistence).to.be.true;
        });
        it('should write the JDL inside the file', () => {
          expect(jdlContent).to.equal('entity Toto\n');
        });
      });
      context('without a path', () => {
        const DEFAULT_PATH = 'app.jdl';
        let fileExistence;
        let jdlContent = '';

        before(() => {
          const jdlObject = new ValidatedJDLObject();
          jdlObject.addEntity(
            new JDLEntity({
              name: 'Toto'
            })
          );
          JDLExporter.exportToJDL(jdlObject);
          fileExistence = fs.statSync(DEFAULT_PATH).isFile();
          jdlContent = fs.readFileSync(DEFAULT_PATH, 'utf-8').toString();
        });

        after(() => {
          fs.unlinkSync(DEFAULT_PATH);
        });

        it('should export the JDL to the default one', () => {
          expect(fileExistence).to.be.true;
        });
        it('should write the JDL inside the file', () => {
          expect(jdlContent).to.equal('entity Toto\n');
        });
      });
    });

    context('when passing unknown configs', () => {
      const PATH = 'app.jdl';
      let fileExistence;
      let jdlContent;
      let loggerDebug;

      before(() => {
        loggerDebug = sinon.spy(logger, 'debug');
        const jdlApplication = new JDLApplication({
          config: {
            baseName: 'toto',
            toto: 'foo'
          }
        });
        const jdlObject = new JDLObject();
        jdlObject.addApplication(jdlApplication);
        JDLExporter.exportToJDL(jdlObject);
        fileExistence = fs.statSync(PATH).isFile();
        jdlContent = fs.readFileSync(PATH, 'utf-8').toString();
      });

      after(() => {
        fs.unlinkSync(PATH);
        loggerDebug.restore();
      });

      it('should export the JDL to the passed path', () => {
        expect(fileExistence).to.be.true;
      });
      it('should write the JDL inside the file', () => {
        expect(jdlContent).to.not.contain('toto foo\n');
      });
      it('should send a debug message', () => {
        expect(loggerDebug).to.have.been.calledOnce;
        expect(loggerDebug.getCall(0).args[0]).to.equal('Unrecognized application option name and value: toto and foo');
      });
    });

    context('with value that must be quoted', () => {
      const PATH = 'app.jdl';
      let fileExistence;
      let jdlContent = '';

      before(() => {
        const definitions = new JCoreDefinitions({
          applicationOptions: {
            toto: {
              type: 'string'
            },
            foo: {
              type: 'string'
            }
          }
        });
        const jdlApplication = new JDLApplication({
          config: {
            baseName: 'toto',
            toto: 'fo$o',
            foo: 'bar.'
          },
          definitions
        });
        const jdlObject = new JDLObject();
        jdlObject.addApplication(jdlApplication);
        JDLExporter.exportToJDL(jdlObject, PATH, { exportUnregisteredConfigs: true });
        fileExistence = fs.statSync(PATH).isFile();
        jdlContent = fs.readFileSync(PATH, 'utf-8').toString();
      });

      after(() => {
        fs.unlinkSync(PATH);
      });

      it('should export the JDL to the passed path', () => {
        expect(fileExistence).to.be.true;
      });
      it('should write \'toto "fo$o"\' inside the file', () => {
        expect(jdlContent).to.contain('toto "fo$o"\n');
      });
      it('should write \'foo "bar."\' inside the file', () => {
        expect(jdlContent).to.contain('foo "bar."\n');
      });
    });

    context('with custom definitions', () => {
      const PATH = 'app.jdl';
      let fileExistence;
      let jdlContent = '';
      before(() => {
        const jdlObject = new JDLObject();
        const definitions = new JCoreDefinitions({
          applicationOptions: {
            toto: {
              type: 'string',
              values: {
                foo: 'foo'
              }
            }
          }
        });
        const jdlApplication = new JDLApplication({
          config: {
            baseName: 'toto',
            toto: 'foo'
          },
          definitions
        });
        jdlObject.addApplication(jdlApplication);
        JDLExporter.exportToJDL(jdlObject, PATH);
        fileExistence = fs.statSync(PATH).isFile();
        jdlContent = fs.readFileSync(PATH, 'utf-8').toString();
      });

      after(() => {
        fs.unlinkSync(PATH);
      });

      it('should export the JDL to the passed path', () => {
        expect(fileExistence).to.be.true;
      });
      it("should write 'toto foo' inside the file", () => {
        expect(jdlContent).to.contain('toto foo\n');
      });
      it("should not 'baseName toto' inside the file", () => {
        expect(jdlContent).to.not.contain('baseName toto\n');
      });
    });
  });
});
