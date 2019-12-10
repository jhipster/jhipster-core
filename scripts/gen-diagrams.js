/**
 * A template for generating syntax diagrams html file.
 * See: https://github.com/SAP/chevrotain/tree/master/diagrams for more details
 */
const path = require('path');
const fs = require('fs');
const chevrotain = require('chevrotain');

const JDLParser = require('../lib/dsl/jdl_parser');

// extract the serialized grammar.
const parserInstance = JDLParser.getParser();
parserInstance.parse();
const serializedGrammar = parserInstance.getSerializedGastProductions();

// create the HTML Text
const htmlText = chevrotain.createSyntaxDiagramsCode(serializedGrammar);

// Write the HTML file to disk
const outPath = path.resolve(__dirname, './');
fs.writeFileSync(`${outPath}/../diagrams.html`, htmlText);
