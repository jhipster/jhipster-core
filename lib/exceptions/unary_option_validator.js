const OptionValidator = require('./option_validator');

class UnaryOptionValidator extends OptionValidator {
  constructor() {
    super('unary');
  }
}

module.exports = UnaryOptionValidator;
