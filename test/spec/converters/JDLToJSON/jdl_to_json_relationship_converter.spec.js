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

const { expect } = require('chai');
const JDLRelationship = require('../../../../lib/core/jdl_relationship');
const { convert } = require('../../../../lib/converters/JDLToJSON/jdl_to_json_relationship_converter');

describe('JDLToJSONRelationshipConverter', () => {
  describe('convert', () => {
    context('when not passing any relationship', () => {
      it('should return an empty map', () => {
        expect(convert([]).size).to.equal(0);
        expect(convert([], ['A', 'B']).size).to.equal(0);
      });
    });
    context('when not passing any entity name', () => {
      it('should return an empty map', () => {
        expect(convert(undefined, []).size).to.equal(0);
        expect(convert([], []).size).to.equal(0);
      });
    });
    context('when passing relationships and entity names', () => {
      it('should convert them', () => {});
    });
  });
});
