/* eslint-disable no-new, no-unused-expressions */
const expect = require('chai').expect;
const tokens = require('../../../lib/dsl/lexer').tokens;
const getSyntacticAutoCompleteSuggestions = require('../../../lib/dsl/api')
  .getSyntacticAutoCompleteSuggestions;

describe('ChevrotainParser', () => {
  describe('when parsing', () => {
    describe('when wanting an auto-completion', () => {
      describe('with an empty text', () => {
        it('provides suggestions', () => {
          const input = '';
          const result = getSyntacticAutoCompleteSuggestions(input);
          expect(result).to.have.lengthOf(17);
          expect(result).to.have.members([
            tokens.APPLICATION,
            tokens.NAME,
            tokens.ENTITY,
            tokens.RELATIONSHIP,
            tokens.ENUM,
            tokens.DTO,
            tokens.SERVICE,
            tokens.SEARCH,
            tokens.MICROSERVICE,
            tokens.COMMENT,
            tokens.PAGINATE,
            tokens.SKIP_CLIENT,
            tokens.SKIP_SERVER,
            tokens.NO_FLUENT_METHOD,
            tokens.ANGULAR_SUFFIX,
            tokens.FILTER,
            tokens.CLIENT_ROOT_FOLDER
          ]);
        });
      });
      describe('with a custom start rule', () => {
        it('provides suggestions', () => {
          const input = 'lastName string ';
          const result = getSyntacticAutoCompleteSuggestions(
            input,
            'fieldDeclaration'
          );
          expect(result).to.have.lengthOf(4);
          // Note that because we are using token Inheritance with the MIN_MAX_KEYWORD an auto-complete provider would have
          // to translate this to concrete tokens (MIN/MAX/MAX_BYTES/MIN_BYTES/...)
          expect(result).to.have.members([
            tokens.REQUIRED,
            tokens.MIN_MAX_KEYWORD,
            tokens.PATTERN,
            tokens.COMMENT
          ]);
        });
      });
      describe('with a default start rule', () => {
        it('provides suggestions', () => {
          const input = `
            entity person {
            lastName string `;

          const result = getSyntacticAutoCompleteSuggestions(input);
          expect(result).to.have.lengthOf(7);
          expect(result).to.have.members([
            tokens.REQUIRED,
            tokens.MIN_MAX_KEYWORD,
            tokens.PATTERN,
            // Note that this will have more suggestions than the previous spec as there is a deeper rule stack.
            tokens.COMMA,
            tokens.RCURLY,
            tokens.COMMENT,
            tokens.NAME
          ]);
        });
      });
    });
  });
});
