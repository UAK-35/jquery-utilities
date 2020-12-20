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

  _logDetails(result, textStatus, jqXHR, ajaxCallDetails) {
    const excerptLength = 200
    console.group('AJAX SUCCESS')
    this._userInteraction.logit('XHR-status = ' + jqXHR.status + '; XHR-response-text = ' + this._jsHelper.excerpt(jqXHR.responseText, excerptLength))
    this._userInteraction.logit('status = ' + textStatus)
    this._userInteraction.logjson('AJAX ajax call details = ', ajaxCallDetails)
    if (this._jsHelper.isStringVar(result)) {
      if (result.indexOf('<!DOCTYPE ') === 0) this._userInteraction.logit('DATA RECEIVED - HTML PAGE = ' + this._jsHelper.excerpt(result, excerptLength))
      else this._userInteraction.logit('DATA RECEIVED - STRING/TEXT = ' + result)
    } else this._userInteraction.logjson('DATA RECEIVED - JSON = ', result)
    console.groupEnd()
  }

  _prepareOptions(options, headers, corsRequest) {
    // if (!options.url || options.url.length === 0) throw new Error('url not specified')
    headers.push({name: 'x-requested-with', value: 'XMLHttpRequest'})

    let ajaxOptions = Object.assign(this._defaultOptions, options)
    ajaxOptions.url = options.url
    ajaxOptions.type = options.type
    for (let h = 0; h < headers.length; h++) ajaxOptions.headers[headers[h]['name']] = headers[h]['value']

    if (corsRequest) {
      // ajaxOptions.crossDomain = true;
      ajaxOptions.crossOrigin = true
    }
    this._userInteraction.logit('corsRequest = ' + corsRequest)
    return ajaxOptions
  }

  _onSuccess(ajaxCallDetails, successOptions, options) {
    const $this = this
    return function (result, textStatus, jqXHR) {
      $this._logDetails(result, textStatus, jqXHR, ajaxCallDetails)

      if (successOptions.successMessage) {
        $this._userInteraction.successAlert(successOptions.successMessage)
      }
      if (successOptions.successCallback) {
        successOptions.successCallback(result, options.url, textStatus)
      }
    }
  }

  _onError(ajaxCallDetails, failureOptions) {
    const $this = this
    return function (jqXHR, textStatus, errorThrown) {
      // textStatus >> "timeout", "error", "abort", and "parsererror"
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

  _validateOptions(options, postData, headers, corsRequest) {
    // if (!options.type) throw new Error('request method not specified')
    if (options.type === 'POST' && (!postData || postData.length === 0)) throw new Error('POST request has no data to send')

    const ajaxOptions = this._prepareOptions(options, headers, corsRequest)
    this._userInteraction.logjson('JUST-BEFORE-AJAX-CALL: ', ajaxOptions)
    if (postData) {
      this._userInteraction.logit('sending post data : ' + this._jsHelper.excerpt(postData, 1000))
      ajaxOptions.data = postData
    }
    return ajaxOptions
  }

  _performAjax(options, postData, successOptions, failureOptions, headers, corsRequest) {
    if (corsRequest === null || corsRequest === undefined) corsRequest = false
    const ajaxCallDetails = {corsRequest: corsRequest, httpMethod: options.type, url: options.url}

    try {
      this._validateHeaders(headers, options.type)
      let ajaxOptions = this._validateOptions(options, postData, headers, corsRequest)
      ajaxCallDetails.headers = ajaxOptions.headers
      ajaxCallDetails.postData = this._jsHelper.excerpt(postData, 1000)

      ajaxOptions = Object.assign(ajaxOptions, {
        beforeSend: this._onBeforeSend(),
        complete: this._onComplete(options),
        error: this._onError(ajaxCallDetails, failureOptions),
        success: this._onSuccess(ajaxCallDetails, successOptions, options),
      })

      $.ajax(ajaxOptions)
    } catch (e) {
      if (failureOptions.failureCallback) failureOptions.failureCallback('error', e)
      // else throw e
    }
  }

  performGet(url, successOptions, failureOptions, headers, corsRequest) {
    this._performAjax({url: url}, null, successOptions, failureOptions, headers, corsRequest)
  }

  performPost(url, postData, successOptions, failureOptions, headers, corsRequest) {
    this._performAjax({type: 'POST', url: url}, postData, successOptions, failureOptions, headers, corsRequest)
  }

  performPostMultipartForm(url, postData, successOptions, failureOptions, headers, corsRequest) {
    const options = {processData: false, contentType: false, mimeType: 'multipart/form-data', type: 'POST', url: url, enctype: 'multipart/form-data'}
    postData = postData.replace(/\$&/g, '\r\n')
    this._performAjax(options, postData, successOptions, failureOptions, headers, corsRequest)
  }

  performPostJson(url, postData, successOptions, failureOptions, headers, corsRequest) {
    this._performAjax({type: 'POST', url: url}, this._jsHelper.rectifyPostJsonData(postData), successOptions, failureOptions, headers, corsRequest)
  }
}

module.exports = JqAjaxHandler
