/** @format */

const JqAjaxHandler = require('./ajaxHandler')
const JqAjaxHeadersManager = require('./headersManager')

class JqAjaxPostManager {
  _ajaxHandler = new JqAjaxHandler()
  _headersManager = new JqAjaxHeadersManager()

  constructor() {}

  set userInteraction(value) {
    this._ajaxHandler.userInteraction = value
  }

  set jsHelper(value) {
    this._ajaxHandler.jsHelper = value
  }

  _performPost(requestContentType, responseAcceptType, url, postData, headers, successOptions, failureOptions, corsRequest) {
    this._headersManager.setForPost(headers, requestContentType, responseAcceptType)
    if (requestContentType === 'json') this._ajaxHandler.performAjaxPostJson(url, postData, successOptions, failureOptions, this._headersManager.headers, corsRequest)
    else this._ajaxHandler.performAjaxPost(url, postData, successOptions, failureOptions, this._headersManager.headers, corsRequest)
  }

  // POST methods below (LOCAL)

  performAjaxPostInvalid(url, postData, successOptions, failureOptions, headers) {
    this._performPost('xyz', 'def', url, postData, headers, successOptions, failureOptions)
  }

  performAjaxPost(url, postData, successOptions, failureOptions, headers) {
    this._performPost('raw', 'raw', url, postData, headers, successOptions, failureOptions)
  }

  performAjaxPostGetJson(url, postData, successOptions, failureOptions, headers) {
    this._performPost('raw', 'json', url, postData, headers, successOptions, failureOptions)
  }

  performAjaxPostForm(url, postData, successOptions, failureOptions, headers) {
    this._performPost('form', 'raw', url, postData, headers, successOptions, failureOptions)
  }

  performAjaxPostFormGetJson(url, postData, successOptions, failureOptions, headers) {
    this._performPost('form', 'json', url, postData, headers, successOptions, failureOptions)
  }

  // performAjaxPostMultiPartFormGetJson(url, postData, successOptions, failureOptions, headers) {
  //   this._performPost('multi-part-form', 'json', url, postData, headers, successOptions, failureOptions);
  // }

  performAjaxPostJson(url, postData, successOptions, failureOptions, headers) {
    this._performPost('json', 'json', url, postData, headers, successOptions, failureOptions)
  }

  // POST methods below (CORS)

  performCorsAjaxPost(url, postData, successOptions, failureOptions, headers) {
    this._performPost('raw', 'raw', url, postData, headers, successOptions, failureOptions, true)
  }

  performCorsAjaxPostGetJson(url, postData, successOptions, failureOptions, headers) {
    this._performPost('raw', 'json', url, postData, headers, successOptions, failureOptions, true)
  }

  performCorsAjaxPostForm(url, postData, successOptions, failureOptions, headers) {
    this._performPost('form', 'raw', url, postData, headers, successOptions, failureOptions, true)
  }

  performCorsAjaxPostFormGetJson(url, postData, successOptions, failureOptions, headers) {
    this._performPost('form', 'json', url, postData, headers, successOptions, failureOptions, true)
  }

  // performCorsAjaxPostMultiPartFormGetJson(url, postData, successOptions, failureOptions, headers) {
  //   this._performPost('multi-part-form', 'json', url, postData, headers, successOptions, failureOptions);
  // }

  performCorsAjaxPostJson(url, postData, successOptions, failureOptions, headers) {
    this._performPost('json', 'json', url, postData, headers, successOptions, failureOptions, true)
  }
}

module.exports = JqAjaxPostManager
