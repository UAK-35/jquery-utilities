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
    this._addToHeaders([{name: 'Content-Type', value: contentType}])
  }

  _addAcceptResponseRequestHeader(contentType) {
    this._addToHeaders([{name: 'Accept', value: contentType}])
  }

  setForGet(headers, responseAcceptType) {
    this._addToHeaders(headers)
    if (responseAcceptType === 'raw') this._addAcceptResponseRequestHeader('text/plain')
    else if (responseAcceptType === 'json') this._addAcceptResponseRequestHeader('application/json')
  }

  _getContentType(requestContentType) {
    let contentType = ''
    if (requestContentType && requestContentType.length > 0) {
      if (requestContentType === 'raw') contentType = 'text/plain'
      else if (requestContentType === 'json') contentType = 'application/json'
      else if (requestContentType === 'form') contentType = 'application/x-www-form-urlencoded'
      else if (requestContentType === 'multi-part-form') contentType = 'multipart/form-data'
    }
    return contentType
  }

  _getAcceptType(responseAcceptType) {
    let acceptType = ''
    if (responseAcceptType && responseAcceptType.length > 0) {
      if (responseAcceptType === 'raw') acceptType = 'text/plain'
      else if (responseAcceptType === 'json') acceptType = 'application/json'
    }
    return acceptType
  }

  setForPost(headers, requestContentType, responseAcceptType) {
    this._addToHeaders(headers)
    let contentType = this._getContentType(requestContentType)
    if (contentType.length > 0) this._addContentTypeRequestHeader(contentType)
    let acceptType = this._getAcceptType(responseAcceptType)
    if (acceptType.length > 0) this._addAcceptResponseRequestHeader(acceptType)
  }
}

module.exports = JqAjaxHeadersManager
