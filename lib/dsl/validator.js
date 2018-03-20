const JDLParser = require('./parser').JDLParser;
const t = require('./lexer').tokens;
const _ = require('lodash');
const tokenMatcher = require('chevrotain').tokenMatcher;
const checkConfigKeys = require('./self_checks').checkConfigKeys;

module.exports = {
  performAdditionalSyntaxChecks
};

function performAdditionalSyntaxChecks(cst) {
// eslint-disable-next-line no-use-before-define
  const syntaxValidatorVisitor = new JDLSyntaxValidatorVisitor();
  syntaxValidatorVisitor.visit(cst);
  return syntaxValidatorVisitor.errors;
}

// TODO: REVIEW these patterns
const constantPattern = /^[A-Z_]+$/;
const entityNamePattern = /^[A-Z][A-z0-9]*$/;
const fieldNamePattern = /^[A-Za-z][A-z0-9]*$/;
const typeNamePattern = /^[A-Z][A-z0-9]*$/;
const injectedFieldNamePattern = /^[A-Za-z][A-z0-9]*$/;
const enumNamePattern = /^[A-Z][A-z0-9]*$/;
const enumPropNamePattern = /^[A-Z][A-z0-9_]*$/;
const methodNamePattern = /^[A-z][A-z0-9-]*$/;
const alphabetic = /^[A-z]+$/;
const alphabeticLower = /^[a-z]+$/;
const jhiPrefixNamePattern = /^[A-z][A-z0-9-]*$/;

const BaseJDLCSTVisitorWithDefaults = new JDLParser().getBaseCstVisitorConstructorWithDefaults();

const configPropsValidations = {
  BASE_NAME: {
    type: 'NAME',
    pattern: alphabetic,
    msg: 'baseName property'
  },
  PATH: { type: 'STRING' },
  PACKAGE_NAME: {
    type: 'qualifiedName',
    pattern: alphabeticLower,
    msg: 'packageName property'
  },
  AUTHENTICATION_TYPE: {
    type: 'NAME',
    pattern: alphabetic,
    msg: 'authenticationType property'
  },
  HIBERNATE_CACHE: {
    type: 'NAME',
    pattern: alphabetic,
    msg: 'hibernateCache property'
  },
  CLUSTERED_HTTP_SESSION: {
    type: 'NAME',
    pattern: alphabetic,
    msg: 'clusteredHttpSession property'
  },
  WEBSOCKET: {
    type: 'NAME',
    pattern: alphabetic,
    msg: 'websocket property'
  },
  DATABASE_TYPE: {
    type: 'NAME',
    pattern: alphabetic,
    msg: 'databaseType property'
  },
  DEV_DATABASE_TYPE: {
    type: 'NAME',
    pattern: alphabetic,
    msg: 'devDatabaseType property'
  },
  PROD_DATABASE_TYPE: {
    type: 'NAME',
    pattern: alphabetic,
    msg: 'prodDatabaseType property'
  },
  USE_COMPASS: { type: 'BOOLEAN' },
  BUILD_TOOL: {
    type: 'NAME',
    pattern: alphabetic,
    msg: 'buildTool property'
  },
  SEARCH_ENGINE: { type: 'BOOLEAN' },
  ENABLE_TRANSLATION: { type: 'BOOLEAN' },
  APPLICATION_TYPE: {
    type: 'NAME',
    pattern: alphabeticLower,
    msg: 'applicationType property'
  },
  TEST_FRAMEWORK: {
    type: 'list',
    pattern: alphabeticLower,
    msg: 'testFrameworks property'
  },
  LANGUAGES: {
    type: 'list',
    pattern: alphabeticLower,
    msg: 'languages property'
  },
  SERVER_PORT: { type: 'INTEGER' },
  ENABLE_SOCIAL_SIGN_IN: { type: 'BOOLEAN' },
  USE_SASS: { type: 'BOOLEAN' },
  JHI_PREFIX: {
    type: 'NAME',
    pattern: jhiPrefixNamePattern,
    msg: 'jhiPrefix property'
  },
  MESSAGE_BROKER: { type: 'BOOLEAN' },
  SERVICE_DISCOVERY_TYPE: {
    type: 'NAME',
    pattern: alphabetic,
    msg: 'serviceDiscoveryType property'
  },
  CLIENT_PACKAGE_MANAGER: {
    type: 'NAME',
    pattern: alphabetic,
    msg: 'clientPackageManager property'
  },
  CLIENT_FRAMEWORK: {
    type: 'NAME',
    pattern: alphabetic,
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
  SKIP_SERVER: { type: 'BOOLEAN' }
};

checkConfigKeys(t, _.keys(configPropsValidations));

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
    case 'NAME':
      if (actual.name !== 'qualifiedName') {
        this.errors.push({
          message: `A name is expected, but found: "${
            getFirstToken(actual).image
          }"`,
          token: getFirstToken(actual)
        });
        return false;
      }
      return this.checkIsSingleName(actual);

    case 'qualifiedName':
      if (actual.name !== 'qualifiedName') {
        this.errors.push({
          message: `A fully qualified name is expected, but found: "${
            getFirstToken(actual).image
          }"`,
          token: getFirstToken(actual)
        });
        return false;
      }
      return true;

    case 'list':
      if (actual.name !== 'list') {
        this.errors.push({
          message: `An array of names is expected, but found: "${
            getFirstToken(actual).image
          }"`,
          token: getFirstToken(actual)
        });
        return false;
      }
      return true;

    case 'INTEGER':
      if (actual.tokenType !== t.INTEGER) {
        this.errors.push({
          message: `An integer literal is expected, but found: "${
            getFirstToken(actual).image
          }"`,
          token: getFirstToken(actual)
        });
        return false;
      }
      return true;

    case 'STRING':
      if (actual.tokenType !== t.STRING) {
        this.errors.push({
          message: `A string literal is expected, but found: "${
            getFirstToken(actual).image
          }"`,
          token: getFirstToken(actual)
        });
        return false;
      }
      return true;

    case 'BOOLEAN':
      if (!tokenMatcher(actual, t.BOOLEAN)) {
        this.errors.push({
          message: `A boolean literal is expected, but found: "${
            getFirstToken(actual).image
          }"`,
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

    if (this.checkExpectedValueType(validation.type, value)) {
      if (validation.pattern) {
        value.children.NAME.forEach(nameTok =>
          this.checkNameSyntax(nameTok, validation.pattern, validation.msg)
        );
      }
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
    this.checkNameSyntax(ctx.NAME[0], fieldNamePattern, 'fieldName');
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
        injectedFieldNamePattern,
        'InjectedField'
      );
      if (ctx.InjectedFieldParam) {
        this.checkNameSyntax(
          ctx.InjectedFieldParam[0],
          injectedFieldNamePattern,
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

function trimAnchors(str) {
  return str.replace(/^\^/, '').replace(/\$$/, '');
}

function getFirstToken(tokOrCstNode) {
  if (tokOrCstNode.tokenType) {
    return tokOrCstNode;
  }

  // CST Node - - assumes no nested CST Nodes, only terminals
  return _.flatten(_.values(tokOrCstNode.children)).reduce(
    (firstTok, nextTok) =>
      (firstTok.startOffset > nextTok.startOffset ? nextTok : firstTok),
    { startOffset: Infinity }
  );
}
