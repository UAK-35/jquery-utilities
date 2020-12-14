/** @format */

const JqAjaxHandler = require('./ajaxHandler')
const JqAjaxHeadersManager = require('./headersManager')

class JqAjaxManager {
  _ajaxHandler = new JqAjaxHandler()
  _headersManager = new JqAjaxHeadersManager()

  constructor() {}

  set userInteraction(value) {
    this._ajaxHandler.userInteraction = value
  }

  set jsHelper(value) {
    this._ajaxHandler.jsHelper = value
  }

  // GET methods below (LOCAL)

  performAjaxInvalid(url, successOptions, failureOptions, headers) {
    this._headersManager.setForGet(headers, 'xyz')
    this._ajaxHandler.performAjaxGet(url, successOptions, failureOptions, this._headersManager.headers)
  }

  performAjaxGet(url, successOptions, failureOptions, headers) {
    this._headersManager.setForGet(headers, 'raw')
    this._ajaxHandler.performAjaxGet(url, successOptions, failureOptions, this._headersManager.headers)
  }

  performAjaxGetJson(url, successOptions, failureOptions, headers) {
    this._headersManager.setForGet(headers, 'json')
    this._ajaxHandler.performAjaxGet(url, successOptions, failureOptions, this._headersManager.headers)
  }

  // GET methods below (CORS)

  performCorsAjaxGet(url, successOptions, failureOptions, headers) {
    this._headersManager.setForGet(headers, 'raw')
    this._ajaxHandler.performAjaxGet(url, successOptions, failureOptions, this._headersManager.headers, true)
  }

  performCorsAjaxGetJson(url, successOptions, failureOptions, headers) {
    this._headersManager.setForGet(headers, 'json')
    this._ajaxHandler.performAjaxGet(url, successOptions, failureOptions, this._headersManager.headers, true)
  }

  // POST methods below (LOCAL)

  performAjaxPostInvalid(url, postData, successOptions, failureOptions, headers) {
    this._headersManager.setForPost(headers, 'xyz', 'def')
    this._ajaxHandler.performAjaxPost(url, postData, successOptions, failureOptions, this._headersManager.headers)
  }

  performAjaxPost(url, postData, successOptions, failureOptions, headers) {
    this._headersManager.setForPost(headers, 'raw', 'raw')
    this._ajaxHandler.performAjaxPost(url, postData, successOptions, failureOptions, this._headersManager.headers)
  }

  performAjaxPostGetJson(url, postData, successOptions, failureOptions, headers) {
    this._headersManager.setForPost(headers, 'raw', 'json')
    this._ajaxHandler.performAjaxPost(url, postData, successOptions, failureOptions, this._headersManager.headers)
  }

  performAjaxPostForm(url, postData, successOptions, failureOptions, headers) {
    this._headersManager.setForPost(headers, 'form', 'raw')
    this._ajaxHandler.performAjaxPost(url, postData, successOptions, failureOptions, this._headersManager.headers)
  }

  performAjaxPostFormGetJson(url, postData, successOptions, failureOptions, headers) {
    this._headersManager.setForPost(headers, 'form', 'json')
    this._ajaxHandler.performAjaxPost(url, postData, successOptions, failureOptions, this._headersManager.headers)
  }

  // performAjaxPostMultiPartFormGetJson(url, postData, successOptions, failureOptions, headers) {
  //   this._headersManager.setForPost(headers, 'multi-part-form', 'json');
  //   this._ajaxHandler.performAjaxPost(url, postData, successOptions, failureOptions, this._headersManager.headers);
  // }

  performAjaxPostJson(url, postData, successOptions, failureOptions, headers) {
    this._headersManager.setForPost(headers, 'json', 'json')
    this._ajaxHandler.performAjaxPostJson(url, postData, successOptions, failureOptions, this._headersManager.headers)
  }

  // POST methods below (CORS)

  performCorsAjaxPost(url, postData, successOptions, failureOptions, headers) {
    this._headersManager.setForPost(headers, 'raw', 'raw')
    this._ajaxHandler.performAjaxPost(url, postData, successOptions, failureOptions, this._headersManager.headers, true)
  }

  performCorsAjaxPostGetJson(url, postData, successOptions, failureOptions, headers) {
    this._headersManager.setForPost(headers, 'raw', 'json')
    this._ajaxHandler.performAjaxPost(url, postData, successOptions, failureOptions, this._headersManager.headers, true)
  }

  performCorsAjaxPostForm(url, postData, successOptions, failureOptions, headers) {
    this._headersManager.setForPost(headers, 'form', 'raw')
    this._ajaxHandler.performAjaxPost(url, postData, successOptions, failureOptions, this._headersManager.headers, true)
  }

  performCorsAjaxPostFormGetJson(url, postData, successOptions, failureOptions, headers) {
    this._headersManager.setForPost(headers, 'form', 'json')
    this._ajaxHandler.performAjaxPost(url, postData, successOptions, failureOptions, this._headersManager.headers, true)
  }

  // performCorsAjaxPostMultiPartFormGetJson(url, postData, successOptions, failureOptions, headers) {
  //   this._headersManager.setForPost(headers, 'multi-part-form', 'json');
  //   this._ajaxHandler.performAjaxPost(url, postData, successOptions, failureOptions, this._headersManager.headers, true);
  // }

  performCorsAjaxPostJson(url, postData, successOptions, failureOptions, headers) {
    this._headersManager.setForPost(headers, 'json', 'json')
    this._ajaxHandler.performAjaxPostJson(url, postData, successOptions, failureOptions, this._headersManager.headers, true)
  }
}

module.exports = JqAjaxManager
