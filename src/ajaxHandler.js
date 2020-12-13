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
  }

  constructor() {}

  set userInteraction(value) {
    this._userInteraction = value
  }

  set jsHelper(value) {
    this._jsHelper = value
  }

  _logDetails(userInformer, jsAux, result, textStatus, jqXHR, ajaxCallDetails) {
    // userInformer = this.#_userInteraction;
    // jsAux = this.#_jsHelper;
    console.group('AJAX SUCCESS')
    userInformer.logit('XHR-status = ' + jqXHR.status + '; XHR-response-text = ' + jsAux.excerpt(jqXHR.responseText, 200))
    userInformer.logit('status = ' + textStatus)
    userInformer.logjson('AJAX ajax call details = ', ajaxCallDetails)
    if (jsAux.isStringVar(result) && result.indexOf('<!DOCTYPE ') === 0) {
      userInformer.logit('DATA RECEIVED - HTML PAGE = ' + jsAux.excerpt(result, 200))
    } else {
      if (jsAux.isStringVar(result)) {
        userInformer.logit('DATA RECEIVED - STRING/TEXT = ' + result)
      } else userInformer.logjson('DATA RECEIVED - JSON = ', result)
    }
    console.groupEnd()
  }

  _prepareOptions(options, ajaxOptions, headers, corsRequest) {
    if (options.url) {
      ajaxOptions.url = options.url
    }
    if (options.type) {
      ajaxOptions.type = options.type
    }

    // if (!headers) headers = [{name: 'x-requested-with', value: 'XMLHttpRequest'}]
    // else
    headers.push({name: 'x-requested-with', value: 'XMLHttpRequest'})
    if (headers.find((h) => h.name === 'Accept') === undefined) throw new Error('Accept header not provided or invalid')
    if (options.type === 'POST' && headers.find((h) => h.name === 'Content-Type') === undefined) throw new Error('Content-Type header not provided or invalid')

    if (!ajaxOptions.headers) {
      ajaxOptions.headers = {}
    }
    for (let h = 0; h < headers.length; h++) {
      ajaxOptions.headers[headers[h]['name']] = headers[h]['value']
    }

    if (corsRequest) {
      // ajaxOptions.crossDomain = true;
      ajaxOptions.crossOrigin = true
    }
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

  _performAjax(options, successOptions, failureOptions, headers, corsRequest) {
    if (corsRequest === null || corsRequest === undefined) corsRequest = false
    this._userInteraction.logit('corsRequest = ' + corsRequest)

    const ajaxCallDetails = {corsRequest: corsRequest, httpMethod: options.type, url: options.url}

    let ajaxOptions = {
      beforeSend: this._onBeforeSend(),
      complete: this._onComplete(options),
      error: this._onError(ajaxCallDetails, failureOptions),
      success: this._onSuccess(ajaxCallDetails, successOptions, options),
    }
    ajaxOptions = Object.assign(this._defaultOptions, ajaxOptions)

    try {
      this._prepareOptions(options, ajaxOptions, headers, corsRequest)
    } catch (e) {
      if (failureOptions.failureCallback) failureOptions.failureCallback('error', null)
      return
    }

    this._userInteraction.logjson('JUST-BEFORE-AJAX-CALL: ', ajaxOptions)
    if (options.data) {
      this._userInteraction.logit('sending post data : ' + options.data)
      ajaxOptions.data = options.data
    }

    ajaxCallDetails.headers = ajaxOptions.headers
    ajaxCallDetails.postData = options.data
    $.ajax(ajaxOptions)
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
