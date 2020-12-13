/** @format */

class JqAjaxHeadersManager {
  _headers = []

  constructor() {}

  get headers() {
    return this._headers
  }

  _addToHeaders(newHeaders) {
    if (newHeaders !== null && newHeaders !== undefined)
      for (let h = 0; h < newHeaders.length; h++) {
        this._headers.push(newHeaders[h])
      }
  }

  _addContentTypeRequestHeader(contentType) {
    if (contentType.length > 0) this._addToHeaders([{name: 'Content-Type', value: contentType}])
  }

  _addAcceptResponseRequestHeader(contentType) {
    if (contentType.length > 0) this._addToHeaders([{name: 'Accept', value: contentType}])
  }

  _getAcceptType(responseAcceptType) {
    switch (responseAcceptType) {
      case 'raw':
        return 'text/plain'
      case 'json':
        return 'application/json'
      default:
        return ''
    }
  }

  setForGet(headers, responseAcceptType) {
    this._addToHeaders(headers)
    this._addAcceptResponseRequestHeader(this._getAcceptType(responseAcceptType))
  }

  _getContentType(requestContentType) {
    switch (requestContentType) {
      case 'raw':
        return 'text/plain'
      case 'json':
        return 'application/json'
      case 'form':
        return 'application/x-www-form-urlencoded'
      // case 'multi-part-form':
      //   return 'multipart/form-data'
      default:
        return ''
    }
  }

  setForPost(headers, requestContentType, responseAcceptType) {
    this._addToHeaders(headers)
    this._addContentTypeRequestHeader(this._getContentType(requestContentType))
    this._addAcceptResponseRequestHeader(this._getAcceptType(responseAcceptType))
  }
}

module.exports = JqAjaxHeadersManager
