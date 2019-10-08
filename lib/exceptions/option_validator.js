const Validator = require('./validator');

class OptionValidator extends Validator {
  constructor(optionType, additionalFieldToCheck) {
    const fieldsToCheck = ['name', 'entityNames', 'excludedNames', 'getType'];
    if (additionalFieldToCheck) {
      fieldsToCheck.push(additionalFieldToCheck);
    }
    super(`${optionType} option`, fieldsToCheck);
  }

  validate(jdlOption) {
    super.validate(jdlOption);
  }
}

module.exports = OptionValidator;
