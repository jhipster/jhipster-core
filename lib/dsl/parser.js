const Parser = require('chevrotain').Parser;
const tokensVocabulary = require('./lexer').tokens;

// short name to reduce grammar's verbosity
const t = tokensVocabulary;

class JDLParser extends Parser {
  // Our Parser only gets initialized once, new inputs will be transferred via
  // the ".input" setter.
  constructor() {
    super([], tokensVocabulary, {
      outputCst: true
    });

    const $ = this;

    $.RULE('prog', () => {
      $.MANY(() => {
        $.OR([
          { ALT: () => $.SUBRULE($.entityDeclaration) },
          { ALT: () => $.SUBRULE($.relationDeclaration) },
          { ALT: () => $.SUBRULE($.enumDeclaration) },
          { ALT: () => $.SUBRULE($.dtoDeclaration) },
          { ALT: () => $.SUBRULE($.paginationDeclaration) },
          { ALT: () => $.SUBRULE($.serviceDeclaration) },
          { ALT: () => $.CONSUME(t.COMMENT) },
          { ALT: () => $.SUBRULE($.microserviceDeclaration) },
          { ALT: () => $.SUBRULE($.searchEngineDeclaration) },
          { ALT: () => $.SUBRULE($.noClientDeclaration) },
          { ALT: () => $.SUBRULE($.noServerDeclaration) },
          { ALT: () => $.SUBRULE($.angularSuffixDeclaration) },
          { ALT: () => $.SUBRULE($.noFluentMethod) },
          { ALT: () => $.SUBRULE($.filterDeclaration) },
          { ALT: () => $.SUBRULE($.clientRootFolderDeclaration) },
          { ALT: () => $.SUBRULE($.applicationDeclaration) },
          // a constantDeclaration starts with a NAME, but any keyword is also a NAME
          // So to avoid conflicts with most of the above alternatives (which start with keywords)
          // this alternative must be last.
          {
            // - A Constant starts with a NAME
            // - NAME tokens are very common
            // That is why a more precise lookahead condition is used (The GATE)
            // To avoid confusing errors ("expecting EQUALS but found ...")
            GATE: () => $.LA(2).tokenType === t.EQUALS,
            ALT: () => $.SUBRULE($.constantDeclaration)
          }
        ]);
      });
    });

    $.RULE('constantDeclaration', () => {
      $.CONSUME(t.NAME);
      $.CONSUME(t.EQUALS);
      $.CONSUME(t.INTEGER);
    });

    $.RULE('entityDeclaration', () => {
      $.OPTION(() => {
        $.CONSUME(t.COMMENT);
      });

      $.CONSUME(t.ENTITY);
      $.CONSUME(t.NAME);

      $.OPTION1(() => {
        $.SUBRULE($.entityTableNameDeclaration);
      });

      $.OPTION2(() => {
        $.SUBRULE($.entityBody);
      });
    });

    $.RULE('entityTableNameDeclaration', () => {
      $.CONSUME(t.LPAREN);
      $.CONSUME(t.NAME);
      $.CONSUME(t.RPAREN);
    });

    $.RULE('entityBody', () => {
      $.CONSUME(t.LCURLY);
      $.MANY(() => {
        $.SUBRULE($.fieldDeclaration);
        $.OPTION(() => {
          $.CONSUME(t.COMMA);
        });
      });
      $.CONSUME(t.RCURLY);
    });

    $.RULE('fieldDeclaration', () => {
      $.OPTION(() => {
        $.CONSUME(t.COMMENT);
      });

      $.CONSUME(t.NAME);
      $.SUBRULE($.type);
      $.MANY(() => {
        $.SUBRULE($.validation);
      });

      $.OPTION2({
        GATE: () => {
          const prevTok = $.LA(0);
          const nextTok = $.LA(1);
          // simulate "SPACE_WITHOUT_NEWLINE" of the PEG parser
          return prevTok.startLine === nextTok.startLine;
        },
        DEF: () => {
          $.CONSUME2(t.COMMENT);
        }
      });
    });

    $.RULE('type', () => {
      $.CONSUME(t.NAME);
    });

    $.RULE('validation', () => {
      $.OR([
        { ALT: () => $.CONSUME(t.REQUIRED) },
        { ALT: () => $.SUBRULE($.minMaxValidation) },
        { ALT: () => $.SUBRULE($.pattern) }
      ]);
    });

    $.RULE('minMaxValidation', () => {
      // Note that "MIN_MAX_KEYWORD" is an abstract token and could match 6 different concrete token types
      $.CONSUME(t.MIN_MAX_KEYWORD);
      $.CONSUME(t.LPAREN);
      $.OR([
        { ALT: () => $.CONSUME(t.INTEGER) },
        { ALT: () => $.CONSUME(t.NAME) }
      ]);
      $.CONSUME(t.RPAREN);
    });

    $.RULE('pattern', () => {
      $.CONSUME(t.PATTERN);
      $.CONSUME(t.LPAREN);
      $.CONSUME(t.REGEX);
      $.CONSUME(t.RPAREN);
    });

    $.RULE('relationDeclaration', () => {
      $.CONSUME(t.RELATIONSHIP);
      $.SUBRULE($.relationshipType);
      $.CONSUME(t.LCURLY);
      $.AT_LEAST_ONE(() => {
        $.SUBRULE($.relationshipBody);
        $.OPTION(() => {
          $.CONSUME(t.COMMA);
        });
      });
      $.CONSUME(t.RCURLY);
    });

    $.RULE('relationshipType', () => {
      $.OR([
        { ALT: () => $.CONSUME(t.ONE_TO_ONE) },
        { ALT: () => $.CONSUME(t.ONE_TO_MANY) },
        { ALT: () => $.CONSUME(t.MANY_TO_ONE) },
        { ALT: () => $.CONSUME(t.MANY_TO_MANY) }
      ]);
    });

    $.RULE('relationshipBody', () => {
      $.SUBRULE($.relationshipSide, { LABEL: 'from' });
      $.CONSUME(t.TO);
      $.SUBRULE2($.relationshipSide, { LABEL: 'to' });
    });

    $.RULE('relationshipSide', () => {
      $.SUBRULE($.comment);
      $.CONSUME(t.NAME);
      $.OPTION(() => {
        $.CONSUME(t.LCURLY);
        $.CONSUME2(t.NAME, { LABEL: 'InjectedField' });

        // TODO (REVIEW-NEEDED): the pegjs grammar allowed parenthesis in 'INJECTED_FIELD_NAME'
        // We are using grammar rules instead of lexer rules for a similar effect.
        // The main difference is that only a single pair of parenthesis are allowed.
        // document this quirk in: https://github.com/jhipster/jhipster-core/issues/184
        $.OPTION1(() => {
          $.CONSUME(t.LPAREN);
          $.CONSUME3(t.NAME, { LABEL: 'InjectedFieldParam' });
          $.CONSUME(t.RPAREN);
        });

        $.OPTION2(() => {
          $.CONSUME(t.REQUIRED);
        });
        $.CONSUME(t.RCURLY);
      });
    });

    $.RULE('enumDeclaration', () => {
      $.CONSUME(t.ENUM);
      $.CONSUME(t.NAME);
      $.CONSUME(t.LCURLY);
      $.SUBRULE($.enumPropList);
      $.CONSUME(t.RCURLY);
    });

    $.RULE('enumPropList', () => {
      $.CONSUME(t.NAME);
      $.MANY(() => {
        $.CONSUME(t.COMMA);
        $.CONSUME2(t.NAME);
      });
    });

    $.RULE('dtoDeclaration', () => {
      $.CONSUME(t.DTO);
      $.SUBRULE($.entityList);
      $.OPTION(() => {
        $.SUBRULE($.exclusion);
      });
    });

    $.RULE('entityList', () => {
      $.MANY({
        // the next section may contain [NAME, WITH], LA(2) check is used to resolve this.
        GATE: () => this.LA(2).tokenType === t.COMMA,
        DEF: () => {
          $.CONSUME(t.NAME);
          $.CONSUME(t.COMMA);
        }
      });
      $.OR([
        { ALT: () => $.CONSUME(t.ALL) },
        { ALT: () => $.CONSUME(t.STAR) },
        // NAME appears after 'ALL' token as an 'ALL' token is also a valid 'NAME' token.
        { ALT: () => $.CONSUME1(t.NAME) }
      ]);
      $.CONSUME(t.WITH);
      $.CONSUME2(t.NAME, { LABEL: 'Method' });
    });

    // combined "exclusionSub" and "exclusion".
    $.RULE('exclusion', () => {
      $.CONSUME(t.EXCEPT);
      $.CONSUME(t.NAME);
      $.MANY(() => {
        $.CONSUME(t.COMMA);
        $.CONSUME2(t.NAME);
      });
    });

    $.RULE('paginationDeclaration', () => {
      $.CONSUME(t.PAGINATE);
      $.SUBRULE($.entityList);
      $.OPTION(() => {
        $.SUBRULE($.exclusion);
      });
    });

    $.RULE('serviceDeclaration', () => {
      $.CONSUME(t.SERVICE);
      $.SUBRULE($.entityList);
      $.OPTION(() => {
        $.SUBRULE($.exclusion);
      });
    });

    $.RULE('microserviceDeclaration', () => {
      $.CONSUME(t.MICROSERVICE);
      $.SUBRULE($.entityList);
      $.OPTION(() => {
        $.SUBRULE($.exclusion);
      });
    });

    $.RULE('searchEngineDeclaration', () => {
      $.CONSUME(t.SEARCH);
      $.SUBRULE($.entityList);
      $.OPTION(() => {
        $.SUBRULE($.exclusion);
      });
    });

    $.RULE('noClientDeclaration', () => {
      $.CONSUME(t.SKIP_CLIENT);
      $.SUBRULE($.filterDef);
      $.OPTION(() => {
        $.SUBRULE($.exclusion);
      });
    });

    $.RULE('noServerDeclaration', () => {
      $.CONSUME(t.SKIP_SERVER);
      $.SUBRULE($.filterDef);
      $.OPTION(() => {
        $.SUBRULE($.exclusion);
      });
    });

    $.RULE('noFluentMethod', () => {
      $.CONSUME(t.NO_FLUENT_METHOD);
      $.SUBRULE($.filterDef);
      $.OPTION(() => {
        $.SUBRULE($.exclusion);
      });
    });

    $.RULE('filterDeclaration', () => {
      $.CONSUME(t.FILTER);
      $.SUBRULE($.filterDef);
      $.OPTION(() => {
        $.SUBRULE($.exclusion);
      });
    });

    $.RULE('clientRootFolderDeclaration', () => {
      $.CONSUME(t.CLIENT_ROOT_FOLDER);
      $.SUBRULE($.entityList);
      $.OPTION(() => {
        $.SUBRULE($.exclusion);
      });
    });

    // merged "subNoServerDeclaration", "subNoFluentMethod", "subFilterDeclaration",
    // "simpleEntityList" and "subNoClientDeclaration"
    // as they are identical
    $.RULE('filterDef', () => {
      $.MANY({
        // the next section may contain [NAME, NOT_A_COMMA], LA(2) check is used to resolve this.
        GATE: () => this.LA(2).tokenType === t.COMMA,
        DEF: () => {
          $.CONSUME(t.NAME);
          $.CONSUME(t.COMMA);
        }
      });
      $.OR([
        { ALT: () => $.CONSUME(t.ALL) },
        { ALT: () => $.CONSUME(t.STAR) },
        // NAME appears after 'ALL' token as an 'ALL' token is also a valid 'NAME' but is more specific.
        { ALT: () => $.CONSUME1(t.NAME) }
      ]);
    });

    $.RULE('angularSuffixDeclaration', () => {
      $.CONSUME(t.ANGULAR_SUFFIX);
      $.SUBRULE($.entityList);
      $.OPTION(() => {
        $.SUBRULE($.exclusion);
      });
    });

    $.RULE('comment', () => {
      $.OPTION(() => {
        $.CONSUME(t.COMMENT);
      });
    });

    $.RULE('applicationDeclaration', () => {
      $.CONSUME(t.APPLICATION);
      $.CONSUME(t.LCURLY);
      $.SUBRULE($.applicationSubDeclaration);
      $.CONSUME(t.RCURLY);
    });

    $.RULE('applicationSubDeclaration', () => {
      $.MANY(() => {
        $.OR([
          { ALT: () => $.SUBRULE($.applicationSubConfig) },
          { ALT: () => $.SUBRULE($.applicationSubEntities) }
        ]);
      });
    });

    $.RULE('applicationSubConfig', () => {
      $.CONSUME(t.CONFIG);
      $.CONSUME(t.LCURLY);
      $.MANY(() => {
        $.OR([
          { ALT: () => $.CONSUME(t.COMMENT) },
          { ALT: () => $.SUBRULE($.applicationConfigDeclaration) }
        ]);
      });
      $.CONSUME(t.RCURLY);
    });

    $.RULE('applicationSubEntities', () => {
      $.CONSUME(t.ENTITIES);
      $.SUBRULE($.filterDef);
      $.OPTION(() => {
        $.SUBRULE($.exclusion);
      });
    });

    // The application config Rule was refactored
    // To reduce repetition and be more like pairs of keys and value
    // This means that we need to check if the value is valid for the key post parsing.
    // (e.g SKIP_CLIENT key id only used with a boolean value)

    // In general this can be refactored even farther and be made into proper
    // key:value pairs like JSON, so adding a new key will not require changing the syntax.
    $.RULE('applicationConfigDeclaration', () => {
      $.CONSUME(t.CONFIG_KEY);
      $.SUBRULE($.configValue);
      $.OPTION(() => {
        $.CONSUME(t.COMMA);
      });
    });

    $.RULE('configValue', () => {
      // note how these alternatives look more and more like a JSON Value Rule.
      // https://www.json.org/
      $.OR([
        { ALT: () => $.CONSUME(t.BOOLEAN) },
        { ALT: () => $.SUBRULE($.qualifiedName) },
        { ALT: () => $.SUBRULE($.list) },
        { ALT: () => $.CONSUME(t.INTEGER) },
        { ALT: () => $.CONSUME(t.STRING) }
      ]);
    });

    $.RULE('qualifiedName', () => {
      $.AT_LEAST_ONE_SEP({
        SEP: t.DOT,
        DEF: () => {
          $.CONSUME(t.NAME);
        }
      });
    });

    $.RULE('list', () => {
      $.CONSUME(t.LSQUARE);
      $.AT_LEAST_ONE_SEP({
        SEP: t.COMMA,
        DEF: () => {
          $.CONSUME(t.NAME);
        }
      });
      $.CONSUME(t.RSQUARE);
    });

    // very important to call this after all the rules have been defined.
    // otherwise the parser may not work correctly as it will lack information
    // derived during the self analysis phase.
    Parser.performSelfAnalysis(this);
  }
}

// cannot export a class before definition unlike functions
module.exports = {
  // eslint-disable-next-line
  JDLParser
};
