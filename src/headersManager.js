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

  _addRequestHeader(headerName, headerValue) {
    this._addToHeaders([{name: headerName, value: headerValue}])
  }

  _addContentTypeRequestHeader(contentType) {
    if (contentType.length > 0) this._addRequestHeader('Content-Type', contentType)
  }

  _addAcceptResponseRequestHeader(acceptType) {
    if (acceptType.length > 0) this._addRequestHeader('Accept', acceptType)
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

  _getContentType(requestContentType, boundary) {
    switch (requestContentType) {
      case 'raw':
        return 'text/plain'
      case 'json':
        return 'application/json'
      case 'form':
        return 'application/x-www-form-urlencoded'
      case 'multi-part-form':
        return 'multipart/form-data; boundary=' + boundary
      default:
        return ''
    }
  }

  setForPost(headers, requestContentType, responseAcceptType, length, boundary) {
    this._addToHeaders(headers)
    this._addContentTypeRequestHeader(this._getContentType(requestContentType, boundary))
    if (requestContentType === 'multi-part-form') {
      this._addRequestHeader('Cache-Control', 'no-cache')
      this._addRequestHeader('Content-Length', length)
      this._addRequestHeader('Host', 'http://localhost')
      // this._addRequestHeader('User-Agent', 'PostmanRuntime/7.26.8')
      this._addRequestHeader('Accept-Encoding', 'gzip, deflate, br')
      this._addRequestHeader('Connection', 'keep-alive')
    }
    this._addAcceptResponseRequestHeader(this._getAcceptType(responseAcceptType))
    // console.log('headers = ' + JSON.stringify(this._headers, null, 2))
  }
}

module.exports = JqAjaxHeadersManager
