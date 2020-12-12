const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );

class JqAjaxManager {

  _userInteraction;
  _jsHelper;

  _defaultOptions = {
    type: 'GET',
    cache: false,
    async: true,
  };

  set userInteraction(value) {
    this._userInteraction = value;
  }

  set jsHelper(value) {
    this._jsHelper = value;
  }

  get defaultOptions() {
    return this._defaultOptions;
  }

  performAjax(options, successOptions, failureOptions, headers, corsRequest) {
    if (corsRequest === null || corsRequest === undefined) {
      corsRequest = false;
    }
    this._userInteraction.logit("corsRequest = " + corsRequest);

    const ajaxCallDetails = {};
    ajaxCallDetails.corsRequest = corsRequest;

    const userInformer = this._userInteraction;
    const jsAux = this._jsHelper;
    let ajaxOptions = {
      beforeSend: function (jqXHR, settings) {
        userInformer.logit("ajax call started [" + settings.url + "]...");
      },
      complete: function (jqXHR, textStatus) {
        userInformer.logit("ajax call completed [" + options.url + "] (" + textStatus + ")...");
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.group('AJAX FAILURE');
        userInformer.logit("XHR-status = " + jqXHR.status + "; XHR-response-text = " + jqXHR.responseText);
        userInformer.errlogit("AJAX ERROR status = " + textStatus);
        userInformer.errlogitjson("AJAX ERROR thrown = ", errorThrown);
        userInformer.errlogitjson("AJAX ERROR DETAILS = ", jqXHR);
        userInformer.logjson("AJAX ajax call details = ", ajaxCallDetails);
        console.groupEnd();
        if (!!failureOptions.failureMessage) {
          userInformer.errorAlert(failureOptions.failureMessage);
        }
        if (!!failureOptions.failureCallback) {
          // failureOptions.failureCallback(jqXHR, textStatus, errorThrown);
          failureOptions.failureCallback(textStatus, errorThrown);
        }
      },
      success: function(result, textStatus, jqXHR) {
        console.group('AJAX SUCCESS');
        userInformer.logit("XHR-status = " + jqXHR.status + "; XHR-response-text = " + jsAux.excerpt(jqXHR.responseText, 200));
        userInformer.logit("status = " + textStatus);
        userInformer.logjson("AJAX ajax call details = ", ajaxCallDetails);
        if (jsAux.isStringVar(result) && result.indexOf("<!DOCTYPE ") === 0) {
          userInformer.logit("DATA RECEIVED - HTML PAGE = " + jsAux.excerpt(result, 200));
        } else {
          if (jsAux.isStringVar(result)) {
            userInformer.logit("DATA RECEIVED - STRING/TEXT = " + result);
          }
          else
            userInformer.logjson("DATA RECEIVED - JSON = ", result);
        }
        console.groupEnd();

        if (textStatus === "success") {
          if (!!successOptions.successMessage) {
            userInformer.successAlert(successOptions.successMessage);
          }
          if (!!successOptions.successCallback) {
            successOptions.successCallback(result, options.url, textStatus);
          }
        } else {
          if (!!failureOptions.failureMessage) {
            userInformer.errorAlert(failureOptions.failureMessage);
          }
          if (!!failureOptions.failureCallback) {
            failureOptions.failureCallback(textStatus, "error");
          }
        }
      }
    };
    ajaxOptions = Object.assign(this.defaultOptions, ajaxOptions);

    if (!!options.url) {
      ajaxOptions.url = options.url;
    }
    if (!!options.type) {
      ajaxOptions.type = options.type;
    }

    if (!headers)
      headers = [ {name: 'x-requested-with', value: 'XMLHttpRequest'} ];
    else
      headers.push({name: 'x-requested-with', value: 'XMLHttpRequest'});

    if (!ajaxOptions.headers) {
      ajaxOptions.headers = {};
    }
    for (let h = 0; h < headers.length; h++) {
      ajaxOptions.headers[headers[h]['name']] = headers[h]['value'];
    }

    if (corsRequest) {
      // ajaxOptions.crossDomain = true;
      ajaxOptions.crossOrigin = true;
    }

    this._userInteraction.logjson("JUST-BEFORE-AJAX-CALL: ", ajaxOptions);
    if (!!options.data) {
      this._userInteraction.logit("sending post data : " + options.data);
      ajaxOptions.data = options.data;
    }

    ajaxCallDetails.headers = headers;
    ajaxCallDetails.postData = options.data;
    ajaxCallDetails.httpMethod = options.type;
    ajaxCallDetails.url = options.url;
    $.ajax(ajaxOptions);
  }

  addToHeaders(headers, jsonHeaders) {
    if (!headers) {
      headers = [];
    }
    for (let h = 0; h < jsonHeaders.length; h++) {
      headers.push(jsonHeaders[h]);
    }
    return headers;
  }

  addTextRequestHeader(headers) {
    return this.addToHeaders(headers, [
      {'name': "Content-Type", 'value': "text/plain"}
    ]);
  }

  addFormRequestHeader(headers) {
    return this.addToHeaders(headers, [
      {'name': "Content-Type", 'value': "application/x-www-form-urlencoded"}
    ]);
  }

  // addMultiPartFormRequestHeader(headers) {
  //   return this.addToHeaders(headers, [
  //     {'name': "Content-Type", 'value': "multipart/form-data"}
  //   ]);
  // }

  addTextResponseHeader(headers) {
    return this.addToHeaders(headers, [
      {'name': "Accept", 'value': "text/plain"}
    ]);
  }

  addJsonRequestHeader(headers) {
    return this.addToHeaders(headers, [
      {'name': "Content-Type", 'value': "application/json"}
    ]);
  }

  addJsonResponseHeader(headers) {
    return this.addToHeaders(headers, [
      {'name': "Accept", 'value': "application/json"}
    ]);
  }

  createGetOptions(url) {
    return {url: url};
  }

  performAjaxGet(url, headers, successOptions, failureOptions) {
    this.performAjax(this.createGetOptions(url), successOptions, failureOptions, headers);
  }

  performAjaxGetJson(url, headers, successOptions, failureOptions) {
    headers = this.addJsonResponseHeader(headers);
    this.performAjax(this.createGetOptions(url), successOptions, failureOptions, headers);
  }

  performCrossDomainAjaxGet(url, headers, successOptions, failureOptions) {
    this.performAjax(this.createGetOptions(url), successOptions, failureOptions, headers, true);
  }

  performCrossDomainAjaxGetJson(url, headers, successOptions, failureOptions) {
    headers = this.addJsonResponseHeader(headers);
    this._userInteraction.logjson("headers = ", headers);
    this.performAjax(this.createGetOptions(url), successOptions, failureOptions, headers, true);
  }

  createPostOptions(url, postData) {
    return {type: 'POST', url: url, data: postData};
  }

  createPostJsonOptions(url, postData) {
    return {type: 'POST', url: url, data: this._jsHelper.rectifyPostJsonData(postData)};
  }

  performAjaxPost(url, postData, headers, successOptions, failureOptions) {
    headers = this.addTextRequestHeader(headers);
    headers = this.addTextResponseHeader(headers);
    this.performAjax(this.createPostOptions(url, postData), successOptions, failureOptions, headers);
  }

  performAjaxPostGetJson(url, postData, headers, successOptions, failureOptions) {
    headers = this.addTextRequestHeader(headers);
    headers = this.addJsonResponseHeader(headers);
    this.performAjax(this.createPostOptions(url, postData), successOptions, failureOptions, headers);
  }

  performAjaxPostForm(url, postData, headers, successOptions, failureOptions) {
    headers = this.addFormRequestHeader(headers);
    headers = this.addTextResponseHeader(headers);
    this.performAjax(this.createPostOptions(url, postData), successOptions, failureOptions, headers);
  }

  performAjaxPostFormGetJson(url, postData, headers, successOptions, failureOptions) {
    headers = this.addFormRequestHeader(headers);
    headers = this.addJsonResponseHeader(headers);
    this.performAjax(this.createPostOptions(url, postData), successOptions, failureOptions, headers);
  }

  // performAjaxPostMultiPartFormGetJson(url, postData, headers, successOptions, failureOptions) {
  //   headers = this.addMultiPartFormRequestHeader(headers);
  //   headers = this.addJsonResponseHeader(headers);
  //   this.performAjax(this.createPostOptions(url, postData), successOptions, failureOptions, headers);
  // }

  performAjaxPostJson(url, postData, headers, successOptions, failureOptions) {
    headers = this.addJsonRequestHeader(headers);
    headers = this.addJsonResponseHeader(headers);
    this.performAjax(this.createPostJsonOptions(url, postData), successOptions, failureOptions, headers);
  }

  performCrossDomainAjaxPost(url, postData, headers, successOptions, failureOptions) {
    headers = this.addTextRequestHeader(headers);
    headers = this.addTextResponseHeader(headers);
    this.performAjax(this.createPostOptions(url, postData), successOptions, failureOptions, headers, true);
  }

  performCrossDomainAjaxPostGetJson(url, postData, headers, successOptions, failureOptions) {
    headers = this.addTextRequestHeader(headers);
    headers = this.addJsonResponseHeader(headers);
    this.performAjax(this.createPostOptions(url, postData), successOptions, failureOptions, headers, true);
  }

  performCrossDomainAjaxPostForm(url, postData, headers, successOptions, failureOptions) {
    headers = this.addFormRequestHeader(headers);
    headers = this.addJsonResponseHeader(headers);
    this.performAjax(this.createPostOptions(url, postData), successOptions, failureOptions, headers, true);
  }

  performCrossDomainAjaxPostFormGetJson(url, postData, headers, successOptions, failureOptions) {
    headers = this.addFormRequestHeader(headers);
    headers = this.addJsonResponseHeader(headers);
    this.performAjax(this.createPostOptions(url, postData), successOptions, failureOptions, headers, true);
  }

  // performCrossDomainAjaxPostMultiPartFormGetJson(url, postData, headers, successOptions, failureOptions) {
  //   headers = this.addMultiPartFormRequestHeader(headers);
  //   headers = this.addJsonResponseHeader(headers);
  //   this.performAjax(this.createPostOptions(url, postData), successOptions, failureOptions, headers, true);
  // }

  performCrossDomainAjaxPostJson(url, postData, headers, successOptions, failureOptions) {
    headers = this.addJsonRequestHeader(headers);
    headers = this.addJsonResponseHeader(headers);
    this.performAjax(this.createPostJsonOptions(url, postData), successOptions, failureOptions, headers, true);
  }

}

module.exports = JqAjaxManager;
