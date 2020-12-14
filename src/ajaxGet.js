/** @format */

const JqAjaxHandler = require('./ajaxHandler')
const JqAjaxHeadersManager = require('./headersManager')

class JqAjaxGetManager {
  _ajaxHandler = new JqAjaxHandler()
  _headersManager = new JqAjaxHeadersManager()

  constructor() {}

  set userInteraction(value) {
    this._ajaxHandler.userInteraction = value
  }

  set jsHelper(value) {
    this._ajaxHandler.jsHelper = value
  }

  _performGet(responseAcceptType, url, headers, successOptions, failureOptions, corsRequest) {
    this._headersManager.setForGet(headers, responseAcceptType)
    this._ajaxHandler.performAjaxGet(url, successOptions, failureOptions, this._headersManager.headers, corsRequest)
  }

  // GET methods below (LOCAL)

  performAjaxInvalid(url, successOptions, failureOptions, headers) {
    this._performGet('xyz', url, headers, successOptions, failureOptions)
  }

  performAjaxGet(url, successOptions, failureOptions, headers) {
    this._performGet('raw', url, headers, successOptions, failureOptions)
  }

  performAjaxGetJson(url, successOptions, failureOptions, headers) {
    this._performGet('json', url, headers, successOptions, failureOptions)
  }

  // GET methods below (CORS)

  performCorsAjaxGet(url, successOptions, failureOptions, headers) {
    this._performGet('raw', url, headers, successOptions, failureOptions, true)
  }

  performCorsAjaxGetJson(url, successOptions, failureOptions, headers) {
    this._performGet('json', url, headers, successOptions, failureOptions, true)
  }
}

module.exports = JqAjaxGetManager
