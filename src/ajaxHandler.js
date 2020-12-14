/** @format */

const {JSDOM} = require('jsdom')
const {window} = new JSDOM('')
const $ = require('jquery')(window)

class JqAjaxHandler {
  _userInteraction
  _jsHelper

  _defaultOptions = {
    type: 'GET',
    cache: false,
    async: true,
    headers: {},
  }

  constructor() {}

  set userInteraction(value) {
    this._userInteraction = value
  }

  set jsHelper(value) {
    this._jsHelper = value
  }

  _logDetails(userInformer, jsAux, result, textStatus, jqXHR, ajaxCallDetails) {
    const excerptLength = 200
    // userInformer = this.#_userInteraction;
    // jsAux = this.#_jsHelper;
    console.group('AJAX SUCCESS')
    userInformer.logit('XHR-status = ' + jqXHR.status + '; XHR-response-text = ' + jsAux.excerpt(jqXHR.responseText, excerptLength))
    userInformer.logit('status = ' + textStatus)
    userInformer.logjson('AJAX ajax call details = ', ajaxCallDetails)
    if (jsAux.isStringVar(result)) {
      if (result.indexOf('<!DOCTYPE ') === 0) userInformer.logit('DATA RECEIVED - HTML PAGE = ' + jsAux.excerpt(result, excerptLength))
      else userInformer.logit('DATA RECEIVED - STRING/TEXT = ' + result)
    } else userInformer.logjson('DATA RECEIVED - JSON = ', result)
    console.groupEnd()
  }

  _prepareOptions(options, headers, corsRequest) {
    headers.push({name: 'x-requested-with', value: 'XMLHttpRequest'})

    let ajaxOptions = this._defaultOptions
    if (options.url) ajaxOptions.url = options.url
    if (options.type) ajaxOptions.type = options.type
    for (let h = 0; h < headers.length; h++) ajaxOptions.headers[headers[h]['name']] = headers[h]['value']

    if (corsRequest) {
      // ajaxOptions.crossDomain = true;
      ajaxOptions.crossOrigin = true
    }
    this._userInteraction.logit('corsRequest = ' + corsRequest)

    if (options.data) {
      this._userInteraction.logit('sending post data : ' + options.data)
      ajaxOptions.data = options.data
    }
    return ajaxOptions
  }

  _onSuccess(ajaxCallDetails, successOptions, options) {
    const $this = this
    return function (result, textStatus, jqXHR) {
      $this._logDetails($this._userInteraction, $this._jsHelper, result, textStatus, jqXHR, ajaxCallDetails)

      if (textStatus === 'success') {
        if (successOptions.successMessage) {
          $this._userInteraction.successAlert(successOptions.successMessage)
        }
        if (successOptions.successCallback) {
          successOptions.successCallback(result, options.url, textStatus)
        }
      }
    }
  }

  _onError(ajaxCallDetails, failureOptions) {
    const $this = this
    return function (jqXHR, textStatus, errorThrown) {
      console.group('AJAX FAILURE')
      $this._userInteraction.logit('XHR-status = ' + jqXHR.status + '; XHR-response-text = ' + jqXHR.responseText)
      $this._userInteraction.errlogit('AJAX ERROR status = ' + textStatus)
      $this._userInteraction.errlogitjson('AJAX ERROR thrown = ', errorThrown)
      $this._userInteraction.errlogitjson('AJAX ERROR DETAILS = ', jqXHR)
      $this._userInteraction.logjson('AJAX ajax call details = ', ajaxCallDetails)
      console.groupEnd()
      if (failureOptions.failureMessage) {
        $this._userInteraction.errorAlert(failureOptions.failureMessage)
      }
      if (failureOptions.failureCallback) {
        // failureOptions.failureCallback(jqXHR, textStatus, errorThrown);
        failureOptions.failureCallback(textStatus, errorThrown)
      }
    }
  }

  _onComplete(options) {
    const $this = this
    // eslint-disable-next-line no-unused-vars
    return function (jqXHR, textStatus) {
      $this._userInteraction.logit('ajax call completed [' + options.url + '] (' + textStatus + ')...')
    }
  }

  _onBeforeSend() {
    const $this = this
    // eslint-disable-next-line no-unused-vars
    return function (jqXHR, settings) {
      $this._userInteraction.logit('ajax call started [' + settings.url + ']...')
    }
  }

  _validateHeaders(headers, requestMethod) {
    const hasAcceptHeader = headers.find((h) => h.name === 'Accept') === undefined
    const hasContentTypeHeader = headers.find((h) => h.name === 'Content-Type') === undefined
    let exceptionMessage = ''
    if (hasAcceptHeader) exceptionMessage = 'Accept header not provided or invalid'
    if (requestMethod === 'POST' && hasContentTypeHeader) exceptionMessage = 'Content-Type header not provided or invalid'
    if (exceptionMessage.length > 0) throw new Error(exceptionMessage)
  }

  _validateOptions(options) {
    if (options.type === 'POST' && !options.data) throw new Error('POST request has no data to send')
  }

  _performAjax(options, successOptions, failureOptions, headers, corsRequest) {
    if (corsRequest === null || corsRequest === undefined) corsRequest = false

    const ajaxCallDetails = {corsRequest: corsRequest, httpMethod: options.type, url: options.url}

    try {
      this._validateHeaders(headers, options.type)
      this._validateOptions(options)
      let ajaxOptions = this._prepareOptions(options, headers, corsRequest)
      this._userInteraction.logjson('JUST-BEFORE-AJAX-CALL: ', ajaxOptions)

      ajaxOptions = Object.assign(ajaxOptions, {
        beforeSend: this._onBeforeSend(),
        complete: this._onComplete(options),
        error: this._onError(ajaxCallDetails, failureOptions),
        success: this._onSuccess(ajaxCallDetails, successOptions, options),
      })

      ajaxCallDetails.headers = ajaxOptions.headers
      ajaxCallDetails.postData = options.data
      $.ajax(ajaxOptions)
    } catch (e) {
      if (failureOptions.failureCallback) failureOptions.failureCallback('error', null)
    }
  }

  performAjaxGet(url, successOptions, failureOptions, headers, corsRequest) {
    this._performAjax({url: url}, successOptions, failureOptions, headers, corsRequest)
  }

  performAjaxPost(url, postData, successOptions, failureOptions, headers, corsRequest) {
    this._performAjax({type: 'POST', url: url, data: postData}, successOptions, failureOptions, headers, corsRequest)
  }

  performAjaxPostJson(url, postData, successOptions, failureOptions, headers, corsRequest) {
    this._performAjax({type: 'POST', url: url, data: this._jsHelper.rectifyPostJsonData(postData)}, successOptions, failureOptions, headers, corsRequest)
  }
}

module.exports = JqAjaxHandler
