/** Copyright 2013-2018 the original author or authors from the JHipster project.
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
const matchesToken = require('chevrotain').tokenMatcher;
const JDLParser = require('./jdl_parser');
const LexerTokens = require('./lexer').tokens;
const checkConfigKeys = require('./self_checks').checkConfigKeys;

const constantPattern = /^[A-Z_]+$/;
const entityNamePattern = /^[A-Z][A-Za-z0-9]*$/;
const typeNamePattern = /^[A-Z][A-Za-z0-9]*$/;
const enumNamePattern = /^[A-Z][A-Za-z0-9]*$/;
const enumPropNamePattern = /^[A-Z][A-Za-z0-9_]*$/;
const methodNamePattern = /^[A-Za-z][A-Za-z0-9-]*$/;
const jhiPrefixNamePattern = /^[A-Za-z][A-Za-z0-9-_]*$/;
const alphabetic = /^[A-Za-z]+$/;
const alphabeticLower = /^[a-z]+$/;
const alphanumeric = /^[A-Za-z][A-Za-z0-9]*$/;
const alphanumericDash = /^[A-Za-z][A-Za-z0-9-]*$/;
const alphanumericDigitsAnywhere = /^[A-Za-z0-9]+$/;

const configPropsValidations = {
  BASE_NAME: {
    type: 'NAME_CAN_START_DIGIT',
    pattern: alphanumericDigitsAnywhere,
    msg: 'baseName property'
  },
  PACKAGE_NAME: {
    type: 'qualifiedName',
    pattern: alphabeticLower,
    msg: 'packageName property'
  },
  AUTHENTICATION_TYPE: {
    type: 'NAME',
    pattern: alphanumeric,
    msg: 'authenticationType property'
  },
  CACHE_PROVIDER: {
    type: 'NAME',
    pattern: alphanumeric,
    msg: 'cacheProvider property'
  },
  ENABLE_HIBERNATE_CACHE: {
    type: 'BOOLEAN'
  },
  ENABLE_SWAGGER_CODEGEN: {
    type: 'BOOLEAN'
  },
  WEBSOCKET: {
    type: 'NAME',
    pattern: alphanumericDash,
    msg: 'websocket property'
  },
  DATABASE_TYPE: {
    type: 'NAME',
    pattern: alphanumeric,
    msg: 'databaseType property'
  },
  DEV_DATABASE_TYPE: {
    type: 'NAME',
    pattern: alphanumeric,
    msg: 'devDatabaseType property'
  },
  PROD_DATABASE_TYPE: {
    type: 'NAME',
    pattern: alphanumeric,
    msg: 'prodDatabaseType property'
  },
  BUILD_TOOL: {
    type: 'NAME',
    pattern: alphanumeric,
    msg: 'buildTool property'
  },
  SEARCH_ENGINE: {
    type: 'NAME',
    pattern: alphanumeric,
    msg: 'searchEngine property'
  },
  ENABLE_TRANSLATION: { type: 'BOOLEAN' },
  APPLICATION_TYPE: {
    type: 'NAME',
    pattern: alphabeticLower,
    msg: 'applicationType property'
  },
  TEST_FRAMEWORKS: {
    type: 'list',
    pattern: alphanumeric,
    msg: 'testFrameworks property'
  },
  LANGUAGES: {
    type: 'list',
    pattern: alphabeticLower,
    msg: 'languages property'
  },
  SERVER_PORT: { type: 'INTEGER' },
  USE_SASS: { type: 'BOOLEAN' },
  JHI_PREFIX: {
    type: 'NAME',
    pattern: jhiPrefixNamePattern,
    msg: 'jhiPrefix property'
  },
  MESSAGE_BROKER: {
    type: 'NAME',
    pattern: alphanumeric,
    msg: 'messageBroker property'
  },
  SERVICE_DISCOVERY_TYPE: {
    type: 'NAME',
    pattern: alphanumeric,
    msg: 'serviceDiscoveryType property'
  },
  CLIENT_PACKAGE_MANAGER: {
    type: 'NAME',
    pattern: alphanumeric,
    msg: 'clientPackageManager property'
  },
  CLIENT_FRAMEWORK: {
    type: 'NAME',
    pattern: alphanumeric,
    msg: 'clientFramework property'
  },
  NATIVE_LANGUAGE: {
    type: 'NAME',
    pattern: alphabeticLower,
    msg: 'nativeLanguage property'
  },
  FRONT_END_BUILDER: {
    type: 'NAME',
    pattern: alphabetic,
    msg: 'frontendBuilder property'
  },
  SKIP_USER_MANAGEMENT: { type: 'BOOLEAN' },
  SKIP_CLIENT: { type: 'BOOLEAN' },
  SKIP_SERVER: { type: 'BOOLEAN' },
  UAA_BASE_NAME: { type: 'STRING' },
  JHIPSTER_VERSION: { type: 'STRING' }
};

/**
 * TODO: extract classes from this file into new files
 */
module.exports = {
  performAdditionalSyntaxChecks
};

const parser = JDLParser.getParser();
parser.parse();
const BaseJDLCSTVisitorWithDefaults = parser.getBaseCstVisitorConstructorWithDefaults();

/**
 * Note that the logic here assumes the input CST is valid.
 * To make this work with partially formed CST created during automatic error recovery
 * would require refactoring for greater robustness.
 * Meaning we can never assume at least one element exists in a ctx child array
 * e.g:
 * 1. ctx.NAME[0].image --> ctx.NAME[0] ? ctx.NAME[0].image : "???"
 */
class JDLSyntaxValidatorVisitor extends BaseJDLCSTVisitorWithDefaults {
  constructor() {
    super();
    this.validateVisitor();

    this.errors = [];
  }

  checkNameSyntax(token, expectedPattern, errMsgPrefix) {
    if (!expectedPattern.test(token.image)) {
      this.errors.push({
        message: `${errMsgPrefix} name must match: ${trimAnchors(
          expectedPattern.toString()
        )}`,
        token
      });
    }
  }

  checkIsSingleName(fqnCstNode) {
    // A Boolean is allowed as a single name as it is a keyword.
    // Other keywords do not need special handling as they do not explicitly appear in the rule
    // of config values
    if (fqnCstNode.tokenType && _.includes(fqnCstNode.tokenType.CATEGORIES, LexerTokens.BOOLEAN)) {
      // TODO: this is a little hacky, we are returning false to avoid farther checks
      // on "Boolean as names". Can we do this in a cleaner manner?
      return false;
    }

    const dots = fqnCstNode.children.DOT;
    if (dots && dots.length >= 1) {
      this.errors.push({
        message: 'A single name is expected, but found a fully qualified name.',
        token: getFirstToken(fqnCstNode)
      });
      return false;
    }
    return true;
  }

  checkExpectedValueType(expected, actual) {
    switch (expected) {
    case 'NAME_CAN_START_DIGIT':
      if (actual.tokenType !== LexerTokens.NAME_CAN_START_DIGIT
        && !isNameType(actual)) {
        this.errors.push({
          message: `A name is expected, but found: "${getFirstToken(actual).image}"`,
          token: getFirstToken(actual)
        });
        return false;
      }
      return true;
    case 'NAME':
      if (!isNameType(actual)) {
        this.errors.push({
          message: `A name is expected, but found: "${getFirstToken(actual).image}"`,
          token: getFirstToken(actual)
        });
        return false;
      }
      return this.checkIsSingleName(actual);

    case 'qualifiedName':
      if (actual.name !== 'qualifiedName') {
        this.errors.push({
          message: `A fully qualified name is expected, but found: "${getFirstToken(actual).image}"`,
          token: getFirstToken(actual)
        });
        return false;
      }
      return true;

    case 'list':
      if (actual.name !== 'list') {
        this.errors.push({
          message: `An array of names is expected, but found: "${getFirstToken(actual).image}"`,
          token: getFirstToken(actual)
        });
        return false;
      }
      return true;

    case 'INTEGER':
      if (actual.tokenType !== LexerTokens.INTEGER) {
        this.errors.push({
          message: `An integer literal is expected, but found: "${getFirstToken(actual).image}"`,
          token: getFirstToken(actual)
        });
        return false;
      }
      return true;

    case 'STRING':
      if (actual.tokenType !== LexerTokens.STRING) {
        this.errors.push({
          message: `A string literal is expected, but found: "${getFirstToken(actual).image}"`,
          token: getFirstToken(actual)
        });
        return false;
      }
      return true;

    case 'BOOLEAN':
      if (!matchesToken(actual, LexerTokens.BOOLEAN)) {
        this.errors.push({
          message: `A boolean literal is expected, but found: "${getFirstToken(actual).image}"`,
          token: getFirstToken(actual)
        });
        return false;
      }
      return true;

    default:
      throw Error('Non Exhaustive Match');
    }
  }

  checkConfigPropSyntax(key, value) {
    const propertyName = key.tokenType.tokenName;
    const validation = configPropsValidations[propertyName];
    if (!validation) {
      throw Error('Non Exhaustive Match');
    }

    if (this.checkExpectedValueType(validation.type, value) && validation.pattern && value.children && value.children.NAME) {
      value.children.NAME.forEach(nameTok => this.checkNameSyntax(nameTok, validation.pattern, validation.msg));
    }
  }

  constantDeclaration(ctx) {
    super.constantDeclaration(ctx);
    this.checkNameSyntax(ctx.NAME[0], constantPattern, 'Constant');
  }

  entityDeclaration(ctx) {
    super.entityDeclaration(ctx);
    this.checkNameSyntax(ctx.NAME[0], entityNamePattern, 'Entity');
  }

  fieldDeclaration(ctx) {
    super.fieldDeclaration(ctx);
    this.checkNameSyntax(ctx.NAME[0], alphanumeric, 'fieldName');
  }

  type(ctx) {
    super.type(ctx);
    this.checkNameSyntax(ctx.NAME[0], typeNamePattern, 'typeName');
  }

  minMaxValidation(ctx) {
    super.minMaxValidation(ctx);
    if (ctx.NAME) {
      this.checkNameSyntax(ctx.NAME[0], constantPattern, 'constant');
    }
  }

  relationshipSide(ctx) {
    super.relationshipSide(ctx);
    this.checkNameSyntax(ctx.NAME[0], entityNamePattern, 'Entity');

    if (ctx.InjectedField) {
      this.checkNameSyntax(
        ctx.InjectedField[0],
        alphanumeric,
        'InjectedField'
      );
      if (ctx.InjectedFieldParam) {
        this.checkNameSyntax(
          ctx.InjectedFieldParam[0],
          alphanumeric,
          'InjectedField'
        );
      }
    }
  }

  enumDeclaration(ctx) {
    super.enumDeclaration(ctx);
    this.checkNameSyntax(ctx.NAME[0], enumNamePattern, 'Enum');
  }

  enumPropList(ctx) {
    super.enumPropList(ctx);
    ctx.NAME.forEach((nameToken) => {
      this.checkNameSyntax(nameToken, enumPropNamePattern, 'Enum Property');
    });
  }

  entityList(ctx) {
    super.entityList(ctx);
    if (ctx.NAME) {
      ctx.NAME.forEach((nameToken) => {
        this.checkNameSyntax(nameToken, entityNamePattern, 'Entity');
      });
    }

    if (ctx.Method) {
      this.checkNameSyntax(ctx.Method[0], methodNamePattern, 'Method');
    }
  }

  exclusion(ctx) {
    super.exclusion(ctx);
    ctx.NAME.forEach((nameToken) => {
      this.checkNameSyntax(nameToken, entityNamePattern, 'Entity');
    });
  }

  filterDef(ctx) {
    if (ctx.NAME) {
      ctx.NAME.forEach((nameToken) => {
        this.checkNameSyntax(nameToken, entityNamePattern, 'Entity');
      });
    }
  }

  applicationConfigDeclaration(ctx) {
    this.visit(ctx.configValue, ctx.CONFIG_KEY[0]);
  }

  configValue(ctx, configKey) {
    const configValue = _.first(_.first(_.values(ctx)));
    this.checkConfigPropSyntax(configKey, configValue);
  }
}


function performAdditionalSyntaxChecks(cst) {
  const syntaxValidatorVisitor = new JDLSyntaxValidatorVisitor();
  syntaxValidatorVisitor.visit(cst);
  return syntaxValidatorVisitor.errors;
}

checkConfigKeys(LexerTokens, _.keys(configPropsValidations));

function trimAnchors(str) {
  return str.replace(/^\^/, '')
    .replace(/\$$/, '');
}

function getFirstToken(tokOrCstNode) {
  if (tokOrCstNode.tokenType) {
    return tokOrCstNode;
  }

  // CST Node - - assumes no nested CST Nodes, only terminals
  return _.flatten(_.values(tokOrCstNode.children))
    .reduce(
      (firstTok, nextTok) => (firstTok.startOffset > nextTok.startOffset ? nextTok : firstTok),
      { startOffset: Infinity }
    );
}

function isNameType(cstNodeOrToken) {
  return cstNodeOrToken.name === 'qualifiedName'
    // a Boolean (true/false) is also a valid name.
    || (cstNodeOrToken.tokenType && _.includes(cstNodeOrToken.tokenType.CATEGORIES, LexerTokens.BOOLEAN));
}
