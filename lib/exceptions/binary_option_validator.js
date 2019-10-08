const BinaryOptions = require('../core/jhipster/binary_options');
const OptionValidator = require('./option_validator');

class BinaryOptionValidator extends OptionValidator {
  constructor() {
    super('binary', 'value');
  }

  validate(jdlOption) {
    super.validate(jdlOption);
    checkForInvalidValue(jdlOption);
  }
}

module.exports = BinaryOptionValidator;

function checkForInvalidValue(jdlOption) {
  if (!!jdlOption.value && !BinaryOptions.exists(jdlOption.name, jdlOption.value)) {
    throw new Error(`The '${jdlOption.name}' option is not valid for value '${jdlOption.value}'.`);
  }
}
