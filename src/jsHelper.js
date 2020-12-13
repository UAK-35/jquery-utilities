class JsHelper {

  isStringVar(value) {
    return !(value === null || value === undefined) && (typeof value === 'string' || value instanceof String);
  }

  rectifyPostJsonData(postData) {
    return this.isStringVar(postData) ? postData : JSON.stringify(postData);
  }

  excerpt(str, length) {
    if (str.length > length) {
      str = str.substring(0, length) + "...";
    }
    return str + "\n";
  }

}

module.exports = JsHelper;
