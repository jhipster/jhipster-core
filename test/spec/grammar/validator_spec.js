const expect = require('chai').expect;
const parse = require('../../../lib/dsl/api').parse;

describe('the JDLSyntaxValidatorVisitor', () => {
  context('when declaring an application', () => {
    context('and using for applicationType', () => {
      context('a valid value', () => {
        it('does not report a syntax error for name', () => {
          expect(() => parse(`
            application {
              config {
                applicationType foo
              }
            }`)).to.not.throw();
        });

        it('does not report a syntax error for boolean as name', () => {
          expect(() => parse(`
            application {
              config {
                applicationType true
              }
            }`)).to.not.throw();
        });
      });

      context('invalid', () => {
        it('will report a syntax error when using a none name', () => {
          expect(() => parse(`
            application {
              config {
                applicationType 666
              }
            }`)).to.throw('A name is expected, but found: "666"');
        });

        it('will report a syntax error when using upper case name', () => {
          expect(() => parse(`
            application {
              config {
                applicationType UPPER_CASE_NAME
              }
            }`)).to.throw('applicationType property name must match: /^[a-z]+$/');
        });

        it('will report a syntax error when using a fqn', () => {
          expect(() => parse(`
            application {
              config {
                applicationType foo.bar
              }
            }`)).to.throw('A single name is expected, but found a fully qualified name');
        });
      });
    });

    context('and using for packageName', () => {
      context('a valid value', () => {
        it('does not report a syntax error when provided with a fqn', () => {
          expect(() => parse(`
            application {
              config {
                packageName foo.bar
              }
            }`)).to.not.throw();
        });
      });

      context('invalid', () => {
        it('will report a syntax error when provided with a none fqn', () => {
          expect(() => parse(`
            application {
              config {
                packageName "oops"
              }
            }`)).to.throw('A fully qualified name is expected, but found: ""oops""');
        });
      });
    });

    context('and using for languages', () => {
      context('a valid value', () => {
        it('does not report a syntax error when provided with a fqn', () => {
          expect(() => parse(`
            application {
              config {
                languages [a,b, c]
              }
            }`)).to.not.throw();
        });
      });

      context('invalid', () => {
        it('will report a syntax error when provided with a none fqn', () => {
          expect(() => parse(`
            application {
              config {
                languages true
              }
            }`)).to.throw('An array of names is expected, but found: "true"');
        });
      });
    });

    context('and using for serverPort', () => {
      context('a valid value', () => {
        it('does not report a syntax error', () => {
          expect(() => parse(`
            application {
              config {
                serverPort 6666
              }
            }`)).to.not.throw();
        });
      });

      context('invalid', () => {
        it('will report a syntax error when provided with a none number', () => {
          expect(() => parse(`
            application {
              config {
                serverPort abc
              }
            }`))
            // TODO: maybe we should say "number" expected
            .to.throw('An integer literal is expected, but found: "abc"');
        });

        it('will report a syntax error when provided with a none number', () => {
          expect(() => parse(`
            application {
              config {
                serverPort abc
              }
            }`))
            // TODO: maybe we should say "number" expected instead of integer
            .to.throw('An integer literal is expected, but found: "abc"');
        });

        // TODO: implement error message for negative number
        it.skip('will report a syntax error when provided with a negative number', () => {
          expect(() => parse(`
            application {
              config {
                serverPort -5555
              }
            }`))
            .to.throw();
        });

        // uaaBaseName
      });
    });

    context('and using for uaaBaseName', () => {
      context('a valid value', () => {
        it('does not report a syntax error', () => {
          expect(() => parse(`
            application {
              config {
                uaaBaseName "bamba"
              }
            }`)).to.not.throw();
        });
      });

      context('invalid', () => {
        it('will report a syntax error when provided with a none string literal', () => {
          expect(() => parse(`
            application {
              config {
                uaaBaseName abc
              }
            }`))
            .to.throw('A string literal is expected, but found: "abc"');
        });
      });
    });

    context('and using for enableHibernateCache', () => {
      context('a valid value', () => {
        it('does not report a syntax error', () => {
          expect(() => parse(`
            application {
              config {
                enableHibernateCache true
              }
            }`)).to.not.throw();
        });
      });

      context('invalid', () => {
        it('will report a syntax error when provided with a none boolean', () => {
          expect(() => parse(`
            application {
              config {
                enableHibernateCache 666
              }
            }`)).to.throw('A boolean literal is expected, but found: "666"');
        });
      });
    });
  });
});
