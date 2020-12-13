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

  setForPost(headers, requestContentType, responseAcceptType) {
    this._addToHeaders(headers)

    if (requestContentType && requestContentType.length > 0) {
      let contentType = ''
      if (requestContentType === 'raw') contentType = 'text/plain'
      else if (requestContentType === 'json') contentType = 'application/json'
      else if (requestContentType === 'form') contentType = 'application/x-www-form-urlencoded'
      else if (requestContentType === 'multi-part-form') contentType = 'multipart/form-data'
      if (contentType.length > 0) this._addContentTypeRequestHeader(contentType)
    }

    if (responseAcceptType && responseAcceptType.length > 0) {
      let acceptType = ''
      if (responseAcceptType === 'raw') acceptType = 'text/plain'
      else if (responseAcceptType === 'json') acceptType = 'application/json'
      if (acceptType.length > 0) this._addAcceptResponseRequestHeader(acceptType)
    }
  }
}

module.exports = JqAjaxHeadersManager
