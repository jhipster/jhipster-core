### Future possible improvements:

1. Customize the Error Messages Text.
   - Provide Labels in createToken to customize the default error messages.
     * From: ```Expecting token of type --> EQUALS <-- but found --> 'String' <--```
     * To: ```Expecting token of type --> "=" <-- but found --> 'String' <--```
       
   - Evaluate custom error messages structure.
     https://github.com/SAP/chevrotain/blob/master/examples/parser/custom_errors/custom_errors.js
   
   - Evaluate providing specific err messages to certain CONSUME calls.
     https://github.com/SAP/chevrotain/blob/master/examples/parser/custom_errors/custom_errors.js#L81   
     
2. Provide An LSP/Editor friendly API
   - Enable Error Recovery.
   - Expose the CST directly not the AST (e.g. to construct a code formatter / a prettier plugin).
   - evaluate benefits of Modifying the CST to AST builder to handle partial CSTs (when errors occurred). 
