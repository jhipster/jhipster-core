/**
 * This module includes reflective checks on the DSL implementation.
 * to increase correctness and reduce the TCO.
 */
const { GAstVisitor, Lexer } = require('chevrotain');
const _ = require('lodash');

class TokenCollectorVisitor extends GAstVisitor {
  constructor() {
    super();
    this.actualTokens = [];
  }

  visitTerminal(node) {
    this.actualTokens.push(node.terminalType);
  }

  visitRepetitionMandatoryWithSeparator(node) {
    this.actualTokens.push(node.separator);
  }

  visitRepetitionWithSeparator(node) {
    this.actualTokens.push(node.separator);
  }
}

function findRedundantTokens(allDefinedTokens, rules) {
  const usedTokens = _.reduce(
    rules,
    (result, currRule) => {
      const collector = new TokenCollectorVisitor();
      currRule.accept(collector);
      return _.uniq(result.concat(collector.actualTokens));
    },
    []
  );

  const usedCategories = _.uniq(_.flatMap(usedTokens, 'CATEGORIES'));

  const notDirectlyUsed = _.difference(
    allDefinedTokens,
    _.uniq(usedTokens, usedCategories)
  );

  function memberOfUsedCategory(tok) {
    const tokCategories = tok.CATEGORIES;
    return _.some(tokCategories, cat => _.includes(usedCategories, cat));
  }
  const redundant = _.reject(notDirectlyUsed, memberOfUsedCategory);
  const realRedundant = _.reject(
    redundant,
    tokType => tokType.GROUP === Lexer.SKIPPED
  );

  if (!_.isEmpty(realRedundant)) {
    const redundantTokenNames = realRedundant.map(tokType => tokType.tokenName);
    throw Error(
      `Redundant Token Definitions Found: [ ${redundantTokenNames.join(',')} ]`
    );
  }
}

module.exports = {
  findRedundantTokens
};
