// const VariableValidator = require('./variableValidator');

class JsHelper {

  // variableValidator = new VariableValidator();

  isStringVar(value) {
    // return value && (typeof value === 'string' || value instanceof String);
    return !(value === null || value === undefined) && (typeof value === 'string' || value instanceof String);
  }

  rectifyPostJsonData(postData) {
    // return this.variableValidator.isStringVar(postData) ? postData : JSON.stringify(postData);
    // // return this.variableValidator.isStringVar(postData) ? JSON.parse(postData) : postData;
    return this.isStringVar(postData) ? postData : JSON.stringify(postData);
    // return this.isStringVar(postData) ? JSON.parse(postData) : postData;
  }

  excerpt(str, length) {
    if (str.length > length) {
      str = str.substring(0, length) + "...";
    }
    return str + "\n";
  }

}

module.exports = JsHelper;
