class JqAjaxHeadersManager {

  _headers = [];

  constructor() {
  }

  get headers() {
    return this._headers;
  }

  _addToHeaders(newHeaders) {
    if (newHeaders !== null && newHeaders !== undefined)
      for (let h = 0; h < newHeaders.length; h++) {
        this._headers.push(newHeaders[h]);
      }
  }

  _addContentTypeRequestHeader(contentType) {
    this._addToHeaders([
      {'name': "Content-Type", 'value': contentType}
    ]);
  }

  _addAcceptResponseRequestHeader(contentType) {
    this._addToHeaders([
      {'name': "Accept", 'value': contentType}
    ]);
  }

  setForGet(headers, responseAcceptType) {
    this._addToHeaders(headers);
    if (responseAcceptType === 'raw') this._addAcceptResponseRequestHeader('text/plain');
    else if (responseAcceptType === 'json') this._addAcceptResponseRequestHeader('application/json');
  }

  setForPost(headers, requestContentType, responseAcceptType) {
    this._addToHeaders(headers);

    if (requestContentType === 'raw') this._addContentTypeRequestHeader('text/plain');
    else if (requestContentType === 'json') this._addContentTypeRequestHeader('application/json');
    else if (requestContentType === 'form') this._addContentTypeRequestHeader('application/x-www-form-urlencoded');
    else if (requestContentType === 'multi-part-form') this._addContentTypeRequestHeader('multipart/form-data');

    if (responseAcceptType === 'raw') this._addAcceptResponseRequestHeader('text/plain');
    else if (responseAcceptType === 'json') this._addAcceptResponseRequestHeader('application/json');
  }

}

module.exports = JqAjaxHeadersManager;
