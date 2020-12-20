/** @format */

const JqAjaxHandler = require('./ajaxHandler')
const JqAjaxHeadersManager = require('./headersManager')

const multiPartFormType = 'multi-part-form'

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
    this._headersManager.setForPost(headers, requestContentType, responseAcceptType, postData.length)
    // eslint-disable-next-line sonarjs/no-duplicate-string
    // if (requestContentType === multiPartFormType)
    //   //   this._ajaxHandler.performAjaxPostMultipartForm(url, postData, successOptions, failureOptions, this._headersManager.headers, corsRequest)
    //   throw new Error('Invalid requestContentType')
    if (requestContentType === 'json') this._ajaxHandler.performPostJson(url, postData, successOptions, failureOptions, this._headersManager.headers, corsRequest)
    else this._ajaxHandler.performPost(url, postData, successOptions, failureOptions, this._headersManager.headers, corsRequest)
  }

  _performPostMultipart(requestContentType, responseAcceptType, url, multiPart, headers, successOptions, failureOptions, corsRequest) {
    this._headersManager.setForPost(headers, requestContentType, responseAcceptType, multiPart.requestLength, multiPart.multipartBoundary)
    // if (requestContentType === multiPartFormType)
    this._ajaxHandler.performPostMultipartForm(url, multiPart.requestData, successOptions, failureOptions, this._headersManager.headers, corsRequest)
    // else throw new Error('Invalid requestContentType')
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

  performAjaxPostMultiPartForm(url, multiPart, successOptions, failureOptions, headers) {
    this._performPostMultipart(multiPartFormType, 'raw', url, multiPart, headers, successOptions, failureOptions)
  }

  // performAjaxPostMultiPartFormGetJson(url, multiPart, successOptions, failureOptions, headers) {
  //   this._performPostMultipart(multiPartFormType, 'json', url, multiPart, headers, successOptions, failureOptions);
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

  performCorsAjaxPostMultiPartForm(url, multiPart, successOptions, failureOptions, headers) {
    this._performPostMultipart(multiPartFormType, 'raw', url, multiPart, headers, successOptions, failureOptions, true)
  }

  // performCorsAjaxPostMultiPartFormGetJson(url, multiPart, successOptions, failureOptions, headers) {
  //   this._performPostMultipart(multiPartFormType, 'json', url, multiPart, headers, successOptions, failureOptions, true);
  // }

  performCorsAjaxPostJson(url, postData, successOptions, failureOptions, headers) {
    this._performPost('json', 'json', url, postData, headers, successOptions, failureOptions, true)
  }
}

module.exports = JqAjaxPostManager
