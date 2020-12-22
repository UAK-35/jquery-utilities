# jquery-utilities
[![GitHub](https://img.shields.io/github/license/UAK-35/jquery-utilities?color=yellow)](https://github.com/UAK-35/jquery-utilities/blob/main/LICENSE)
[![npm version](https://badge.fury.io/js/%40uak2020%2Fjquery-utilities.svg)](https://badge.fury.io/js/%40uak2020%2Fjquery-utilities)
[![Build Status](https://travis-ci.com/UAK-35/jquery-utilities.svg?token=b6yC3xZ4n29K1aBw3JL6&branch=main)](https://travis-ci.com/UAK-35/jquery-utilities)
[![Coverage Status](https://coveralls.io/repos/github/UAK-35/jquery-utilities/badge.svg?branch=main)](https://coveralls.io/github/UAK-35/jquery-utilities?branch=main)
[![Maintainability](https://api.codeclimate.com/v1/badges/bfd6d414400b5f2d23fe/maintainability)](https://codeclimate.com/github/UAK-35/jquery-utilities/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/bfd6d414400b5f2d23fe/test_coverage)](https://codeclimate.com/github/UAK-35/jquery-utilities/test_coverage)

> istanbul (nyc) coverage report

| Statements                  | Branches                | Functions                 | Lines                |
| --------------------------- | ----------------------- | ------------------------- | -------------------- |
| ![Statements](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg) | ![Branches](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg) | ![Functions](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg) | ![Lines](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg)    |


## About

A set of tools based on jQuery
- Tool 1 - jQuery AJAX Manager

## Installation

`npm install @uak2020/jquery-utilities`

## Usage
### Tool 1 Usage - jQuery AJAX Manager

#### A) Get Requests (JqAjaxGetManager):

##### Usage pre-conditions:

- one must set "userInteraction" field/property of JqAjaxManager object as done below like: `ajaxGetMgr.userInteraction = userInteraction;`
- one must set "jsHelper" field/property of JqAjaxManager object as done/shown below like: `ajaxGetMgr.jsHelper = jsHelper;`

##### Example - 1 (get html from local server) - method performAjaxGet

    var { JqAjaxGetManager, UserInteraction, JsHelper } = require('@uak2020/jquery-utilities');
    
    var userInteraction = new UserInteraction();
    var jsHelper = new JsHelper();
    var ajaxGetMgr = new JqAjaxGetManager();
    ajaxGetMgr.userInteraction = userInteraction;
    ajaxGetMgr.jsHelper = jsHelper;
    ajaxGetMgr.performAjaxGet(
        'http://localhost:5000/test',
        {
            successMessage: 'page loaded',
            successCallback: function (result, url, textStatus) {
                userInteraction.logit(result);
            }
        },
        {
            failureMessage: 'page load error',
            failureCallback: function (textStatus, errorThrown) {
                userInteraction.logerror(errorThrown);
            }
        }
    );

You can write whatever code you want inside the body of callbacks. The *result* parameter of *successCallback* contains the response returned by the server which is raw (text/plain) in this case.

##### Example - 2 (get html from live/online server) - method performCorsAjaxGet

    var { JqAjaxGetManager, UserInteraction, JsHelper } = require('@uak2020/jquery-utilities');
    
    var userInteraction = new UserInteraction();
    var jsHelper = new JsHelper();
    var ajaxGetMgr = new JqAjaxGetManager();
    ajaxGetMgr.userInteraction = userInteraction;
    ajaxGetMgr.jsHelper = jsHelper;
    ajaxGetMgr.performCorsAjaxGet( // NOTE the change here
        'https://uak2020.herokuapp.com/test',
        {
            successMessage: 'page loaded',
            successCallback: function (result, url, textStatus) {
                userInteraction.logit(result);
            }
        },
        {
            failureMessage: 'page load error',
            failureCallback: function (textStatus, errorThrown) {
                userInteraction.logerror(errorThrown);
            }
        },
        [{name: 'origin', value: 'http://localhost'}] // NOTE the change here
    );

##### Example - 3 (get html from local server) - method performAjaxGet - No messages
Note that *successMessage* and *failureMessage* can be omitted as shown below:

    var { JqAjaxGetManager, UserInteraction, JsHelper } = require('@uak2020/jquery-utilities');
    
    var userInteraction = new UserInteraction();
    var jsHelper = new JsHelper();
    var ajaxGetMgr = new JqAjaxGetManager();
    ajaxGetMgr.userInteraction = userInteraction;
    ajaxGetMgr.jsHelper = jsHelper;
    ajaxGetMgr.performAjaxGet(
        'http://localhost:5000/test',
        {
            successCallback: function (result, url, textStatus) {
                userInteraction.logit(result);
            }
        },
        {
            failureCallback: function (textStatus, errorThrown) {
                userInteraction.logerror(errorThrown);
            }
        }
    );

##### Example - 4 (get html from local server) - method performAjaxGet - No callbacks
Note that *successMessage* and *failureMessage* if provided as shown below, then browser alerts will be shown *(This is also true for other examples where messages have been provided)*

    var { JqAjaxGetManager, UserInteraction, JsHelper } = require('@uak2020/jquery-utilities');
    
    var userInteraction = new UserInteraction();
    var jsHelper = new JsHelper();
    var ajaxGetMgr = new JqAjaxGetManager();
    ajaxGetMgr.userInteraction = userInteraction;
    ajaxGetMgr.jsHelper = jsHelper;
    ajaxGetMgr.performAjaxGet(
        'http://localhost:5000/test',
        {
            successMessage: 'page loaded',
        },
        {
            failureMessage: 'page load error',
        }
    );

##### Example - 5 (get JSON from local server) - method performAjaxGetJson

    var { JqAjaxGetManager, UserInteraction, JsHelper } = require('@uak2020/jquery-utilities');
    
    var userInteraction = new UserInteraction();
    var jsHelper = new JsHelper();
    var ajaxGetMgr = new JqAjaxGetManager();
    ajaxGetMgr.userInteraction = userInteraction;
    ajaxGetMgr.jsHelper = jsHelper;
    ajaxGetMgr.performAjaxGetJson( // Note the change here
        'http://localhost:5000/json',
        {
            successMessage: 'json loaded',
            successCallback: function (result, url, textStatus) {
                userInteraction.logit(result);
            }
        },
        {
            failureMessage: 'json load error',
            failureCallback: function (textStatus, errorThrown) {
                userInteraction.logerror(errorThrown);
            }
        }
    );

The *result* parameter of *successCallback* contains the response returned by the server which is a JSON object in this case. Note that you do not need to convert *result* into JSON object.

##### Example - 6 (get JSON from live server) - method performCorsAjaxGetJson

    var { JqAjaxGetManager, UserInteraction, JsHelper } = require('@uak2020/jquery-utilities');
    
    var userInteraction = new UserInteraction();
    var jsHelper = new JsHelper();
    var ajaxGetMgr = new JqAjaxGetManager();
    ajaxGetMgr.userInteraction = userInteraction;
    ajaxGetMgr.jsHelper = jsHelper;
    ajaxGetMgr.performCorsAjaxGetJson( // Note the change here
        'https://uak2020.herokuapp.com/test/json',
        {
            successMessage: 'json loaded',
            successCallback: function (result, url, textStatus) {
                userInteraction.logit(result);
            }
        },
        {
            failureMessage: 'json load error',
            failureCallback: function (textStatus, errorThrown) {
                userInteraction.logerror(errorThrown);
            }
        },
        [{name: 'origin', value: 'http://localhost'}] // Note the change here
    );

###### Points to note:
- The response is a string/text when following methods are used:
  - performAjaxGet
  - performCorsAjaxGet
- The response is a JSON object when following methods are used:
  - performAjaxGetJson
  - performCorsAjaxGetJson

#### B) Simple Post Requests (JqAjaxPostManager):

##### Usage pre-conditions:

- one must set "userInteraction" field/property of JqAjaxManager object as done below like: `ajaxGetMgr.userInteraction = userInteraction;`
- one must set "jsHelper" field/property of JqAjaxManager object as done/shown below like: `ajaxGetMgr.jsHelper = jsHelper;`

##### Example - 1 (post text data to local server) - method performAjaxPost

    // Note the change in the line below: we are now using JqAjaxPostManager
    var { JqAjaxPostManager, UserInteraction, JsHelper } = require('@uak2020/jquery-utilities');
    
    var userInteraction = new UserInteraction();
    var jsHelper = new JsHelper();
    var ajaxPostMgr = new JqAjaxPostManager(); // Note the change here
    ajaxPostMgr.userInteraction = userInteraction; // Note the change here
    ajaxPostMgr.jsHelper = jsHelper; // Note the change here
    ajaxPostMgr.performAjaxPost( // Note the change here
        'http://localhost:5000/postraw',
        'id|4+token|NULL-TOKEN3+geo|us', // Note the change here : this is the POST DATA
        {
            successMessage: 'data submitted',
            successCallback: function (result, url, textStatus) {
                userInteraction.logit(result);
            }
        },
        {
            failureMessage: 'data submission error',
            failureCallback: function (textStatus, errorThrown) {
                userInteraction.logerror(errorThrown);
            }
        }
    );

The *result* parameter of *successCallback* contains the response returned by the server which is raw (text/plain) in this case.

##### Example - 2 (post text data to live server) - method performCorsAjaxPost

    var { JqAjaxPostManager, UserInteraction, JsHelper } = require('@uak2020/jquery-utilities');
    
    var userInteraction = new UserInteraction();
    var jsHelper = new JsHelper();
    var ajaxPostMgr = new JqAjaxPostManager();
    ajaxPostMgr.userInteraction = userInteraction;
    ajaxPostMgr.jsHelper = jsHelper;
    ajaxPostMgr.performCorsAjaxPost( // Note the change here
        'https://uak2020.herokuapp.com/test/postraw',
        'id|4+token|NULL-TOKEN3+geo|us',
        {
            successMessage: 'data submitted',
            successCallback: function (result, url, textStatus) {
                userInteraction.logit(result);
            }
        },
        {
            failureMessage: 'data submission error',
            failureCallback: function (textStatus, errorThrown) {
                userInteraction.logerror(errorThrown);
            }
        },
        [{name: 'origin', value: 'http://localhost'}] // Note the change here
    );

##### Example - 3 (post text data to local server and receive JSON) - method performAjaxPostGetJson

    var { JqAjaxPostManager, UserInteraction, JsHelper } = require('@uak2020/jquery-utilities');
    
    var userInteraction = new UserInteraction();
    var jsHelper = new JsHelper();
    var ajaxPostMgr = new JqAjaxPostManager();
    ajaxPostMgr.userInteraction = userInteraction;
    ajaxPostMgr.jsHelper = jsHelper;
    ajaxPostMgr.performAjaxPostGetJson( // Note the change here
        'https://localhost:5000/postrawforjson',
        'id|4+token|NULL-TOKEN3+geo|us',
        {
            successMessage: 'data submitted',
            successCallback: function (result, url, textStatus) {
                userInteraction.logit(result);
            }
        },
        {
            failureMessage: 'data submission error',
            failureCallback: function (textStatus, errorThrown) {
                userInteraction.logerror(errorThrown);
            }
        }
    );

The *result* parameter of *successCallback* contains the response returned by the server which is a JSON object in this case. Note that you do not need to convert *result* into JSON object.

##### Example - 4 (post text data to live server and receive JSON) - method performCorsAjaxPostGetJson

    var { JqAjaxPostManager, UserInteraction, JsHelper } = require('@uak2020/jquery-utilities');
    
    var userInteraction = new UserInteraction();
    var jsHelper = new JsHelper();
    var ajaxPostMgr = new JqAjaxPostManager();
    ajaxPostMgr.userInteraction = userInteraction;
    ajaxPostMgr.jsHelper = jsHelper;
    ajaxPostMgr.performCorsAjaxPostGetJson( // Note the change here
        'https://uak2020.herokuapp.com/test/postrawforjson',
        'id|4+token|NULL-TOKEN3+geo|us',
        {
            successMessage: 'data submitted',
            successCallback: function (result, url, textStatus) {
                userInteraction.logit(result);
            }
        },
        {
            failureMessage: 'data submission error',
            failureCallback: function (textStatus, errorThrown) {
                userInteraction.logerror(errorThrown);
            }
        },
        [{name: 'origin', value: 'http://localhost'}] // Note the change here
    );

##### Example - 5 (post JSON data to local server and receive JSON) - method performAjaxPostJson

    var { JqAjaxPostManager, UserInteraction, JsHelper } = require('@uak2020/jquery-utilities');
    
    var userInteraction = new UserInteraction();
    var jsHelper = new JsHelper();
    var ajaxPostMgr = new JqAjaxPostManager();
    ajaxPostMgr.userInteraction = userInteraction;
    ajaxPostMgr.jsHelper = jsHelper;
    const POST_JSON_DATA = {id: 1, email: 'test.mail@example.com', first_name: 'Test', last_name: 'User', avatar: 'https://reqres.in/img/faces/2-image.jpg'}
    ajaxPostMgr.performAjaxPostJson( // Note the change here
        'https://localhost:5000/postjson',
        POST_JSON_DATA,
        {
            successMessage: 'data submitted',
            successCallback: function (result, url, textStatus) {
                userInteraction.logit(result);
            }
        },
        {
            failureMessage: 'data submission error',
            failureCallback: function (textStatus, errorThrown) {
                userInteraction.logerror(errorThrown);
            }
        }
    );

##### Example - 6 (post JSON data to live server and receive JSON) - method performCorsAjaxPostJson

    var { JqAjaxPostManager, UserInteraction, JsHelper } = require('@uak2020/jquery-utilities');
    
    var userInteraction = new UserInteraction();
    var jsHelper = new JsHelper();
    var ajaxPostMgr = new JqAjaxPostManager();
    ajaxPostMgr.userInteraction = userInteraction;
    ajaxPostMgr.jsHelper = jsHelper;
    const POST_JSON_DATA = {id: 1, email: 'test.mail@example.com', first_name: 'Test', last_name: 'User', avatar: 'https://reqres.in/img/faces/2-image.jpg'}
    ajaxPostMgr.performCorsAjaxPostJson( // Note the change here
        'https://uak2020.herokuapp.com/test/postjson',
        POST_JSON_DATA,
        {
            successMessage: 'data submitted',
            successCallback: function (result, url, textStatus) {
                userInteraction.logit(result);
            }
        },
        {
            failureMessage: 'data submission error',
            failureCallback: function (textStatus, errorThrown) {
                userInteraction.logerror(errorThrown);
            }
        },
        [{name: 'origin', value: 'http://localhost'}] // Note the change here
    );

###### Points to note:
- The response is a string/text when following methods are used:
    - performAjaxPost
    - performCorsAjaxPost
- The response is a JSON object when following methods are used:
    - performAjaxPostGetJson
    - performCorsAjaxPostGetJson
    - performAjaxPostJson
    - performCorsAjaxPostJson

#### C) Form submission Post Requests (JqAjaxPostManager):

##### Usage pre-conditions:

- one must set "userInteraction" field/property of JqAjaxManager object as done below like: `ajaxGetMgr.userInteraction = userInteraction;`
- one must set "jsHelper" field/property of JqAjaxManager object as done/shown below like: `ajaxGetMgr.jsHelper = jsHelper;`

##### Example - 1 (post form data to local server) - method performAjaxPostForm

    var { JqAjaxPostManager, UserInteraction, JsHelper } = require('@uak2020/jquery-utilities');
    
    var userInteraction = new UserInteraction();
    var jsHelper = new JsHelper();
    var ajaxPostMgr = new JqAjaxPostManager(); 
    ajaxPostMgr.userInteraction = userInteraction; 
    ajaxPostMgr.jsHelper = jsHelper; 
    ajaxPostMgr.performAjaxPostForm( // Note the change here
        'http://localhost:5000/postform',
        'id=4&token=NULL-TOKEN3&geo=us', // this line has the FORM POST DATA
        {
            successMessage: 'data submitted',
            successCallback: function (result, url, textStatus) {
                userInteraction.logit(result);
            }
        },
        {
            failureMessage: 'data submission error',
            failureCallback: function (textStatus, errorThrown) {
                userInteraction.logerror(errorThrown);
            }
        }
    );

The *result* parameter of *successCallback* contains the response returned by the server which is raw (text/plain) in this case.

##### Example - 2 (post form data to live server) - method performCorsAjaxPostForm

    var { JqAjaxPostManager, UserInteraction, JsHelper } = require('@uak2020/jquery-utilities');
    
    var userInteraction = new UserInteraction();
    var jsHelper = new JsHelper();
    var ajaxPostMgr = new JqAjaxPostManager(); 
    ajaxPostMgr.userInteraction = userInteraction; 
    ajaxPostMgr.jsHelper = jsHelper; 
    ajaxPostMgr.performCorsAjaxPostForm( // Note the change here
        'https://uak2020.herokuapp.com/test/postform',
        'id=4&token=NULL-TOKEN3&geo=us', // this line has the FORM POST DATA
        {
            successMessage: 'data submitted',
            successCallback: function (result, url, textStatus) {
                userInteraction.logit(result);
            }
        },
        {
            failureMessage: 'data submission error',
            failureCallback: function (textStatus, errorThrown) {
                userInteraction.logerror(errorThrown);
            }
        },
        [{name: 'origin', value: 'http://localhost'}] // Note the change here
    );

##### Example - 3 (post form data to local server and receive JSON) - method performAjaxPostFormGetJson

    var { JqAjaxPostManager, UserInteraction, JsHelper } = require('@uak2020/jquery-utilities');
    
    var userInteraction = new UserInteraction();
    var jsHelper = new JsHelper();
    var ajaxPostMgr = new JqAjaxPostManager(); 
    ajaxPostMgr.userInteraction = userInteraction; 
    ajaxPostMgr.jsHelper = jsHelper; 
    ajaxPostMgr.performAjaxPostFormGetJson( // Note the change here
        'http://localhost:5000/postformforjson',
        'id=4&token=NULL-TOKEN3&geo=us', // this line has the FORM POST DATA
        {
            successMessage: 'data submitted',
            successCallback: function (result, url, textStatus) {
                userInteraction.logit(result);
            }
        },
        {
            failureMessage: 'data submission error',
            failureCallback: function (textStatus, errorThrown) {
                userInteraction.logerror(errorThrown);
            }
        }
    );

The *result* parameter of *successCallback* contains the response returned by the server which is a JSON object in this case. Note that you do not need to convert *result* into JSON object.

##### Example - 4 (post form data to local server and receive JSON) - method performCorsAjaxPostFormGetJson

    var { JqAjaxPostManager, UserInteraction, JsHelper } = require('@uak2020/jquery-utilities');
    
    var userInteraction = new UserInteraction();
    var jsHelper = new JsHelper();
    var ajaxPostMgr = new JqAjaxPostManager(); 
    ajaxPostMgr.userInteraction = userInteraction; 
    ajaxPostMgr.jsHelper = jsHelper; 
    ajaxPostMgr.performCorsAjaxPostFormGetJson( // Note the change here
        'https://uak2020.herokuapp.com/test/postformforjson',
        'id=4&token=NULL-TOKEN3&geo=us', // this line has the FORM POST DATA
        {
            successMessage: 'data submitted',
            successCallback: function (result, url, textStatus) {
                userInteraction.logit(result);
            }
        },
        {
            failureMessage: 'data submission error',
            failureCallback: function (textStatus, errorThrown) {
                userInteraction.logerror(errorThrown);
            }
        },
        [{name: 'origin', value: 'http://localhost'}] // Note the change here
    );

#### D) Multi-part Form submission Post Requests (JqAjaxPostManager):

##### Usage pre-conditions:

- one must set "userInteraction" field/property of JqAjaxManager object as done below like: `ajaxGetMgr.userInteraction = userInteraction;`
- one must set "jsHelper" field/property of JqAjaxManager object as done/shown below like: `ajaxGetMgr.jsHelper = jsHelper;`
- one must MultiPartBuilder object to perform single/multiple file uploads along with data

##### Example - 1 (post multi-part form data - single file - to local server) - method performAjaxPostMultiPartForm

    // Note the change in the line below: we are now also using MultiPartBuilder
    var { JqAjaxPostManager, MultiPartBuilder, UserInteraction, JsHelper } = require('@uak2020/jquery-utilities');

    // Following 6 lines demonstrate the use of MultiPartBuilder
    const multipartBuilder = new MultiPartBuilder()
    multipartBuilder.start()
    multipartBuilder.addDataMultiPart('name', 'user-01')
    multipartBuilder.addDataMultiPart('json', '[1,3,8,80]') // you need to convert JSON into string
    multipartBuilder.addFileMultiPart('file', 'C:/arrow.jpg')) // must be an absolute path
    multipartBuilder.build()
    
    var userInteraction = new UserInteraction();
    var jsHelper = new JsHelper();
    var ajaxPostMgr = new JqAjaxPostManager(); 
    ajaxPostMgr.userInteraction = userInteraction; 
    ajaxPostMgr.jsHelper = jsHelper; 
    ajaxPostMgr.performAjaxPostMultiPartForm( // Note the change here
        'http://localhost:5000/postformfile',
        multipartBuilder, // this line/object has the MULTI-PART FORM POST DATA
        {
            successMessage: 'data submitted',
            successCallback: function (result, url, textStatus) {
                userInteraction.logit(result);
            },
        },
        {
            failureMessage: 'data submission error',
            failureCallback: function (textStatus, errorThrown) {
                userInteraction.logerror(errorThrown);
            },
        }
    );

The *result* parameter of *successCallback* contains the response returned by the server which is raw (text/plain) in this case.

##### Example - 2 (post multi-part form data - multiple files - to local server) - method performAjaxPostMultiPartForm

    var { JqAjaxPostManager, MultiPartBuilder, UserInteraction, JsHelper } = require('@uak2020/jquery-utilities');

    // Following 7 lines demonstrate the use of MultiPartBuilder for multiple file upload
    const multipartBuilder = new MultiPartBuilder()
    multipartBuilder.start()
    multipartBuilder.addDataMultiPart('name', 'user-11')
    multipartBuilder.addDataMultiPart('json', '[1,3,8,100]') // you need to convert JSON into string
    multipartBuilder.addFileMultiPart('files', 'C:/up-arrow.jpg')) // must be an absolute path and use same 1st argument
    multipartBuilder.addFileMultiPart('files', 'C:/down-arrow.jpg')) // must be an absolute path and use same 1st argument
    multipartBuilder.build()
    
    var userInteraction = new UserInteraction();
    var jsHelper = new JsHelper();
    var ajaxPostMgr = new JqAjaxPostManager(); 
    ajaxPostMgr.userInteraction = userInteraction; 
    ajaxPostMgr.jsHelper = jsHelper; 
    ajaxPostMgr.performAjaxPostMultiPartForm( 
        'http://localhost:5000/postformfiles',
        multipartBuilder, // this line/object has the MULTI-PART FORM POST DATA
        {
            successMessage: 'data submitted',
            successCallback: function (result, url, textStatus) {
                userInteraction.logit(result);
            },
        },
        {
            failureMessage: 'data submission error',
            failureCallback: function (textStatus, errorThrown) {
                userInteraction.logerror(errorThrown);
            },
        }
    );

##### Example - 3 (post multi-part form data - single file - to live server) - method performCorsAjaxPostMultiPartForm

    var { JqAjaxPostManager, MultiPartBuilder, UserInteraction, JsHelper } = require('@uak2020/jquery-utilities');

    const multipartBuilder = new MultiPartBuilder()
    multipartBuilder.start()
    multipartBuilder.addDataMultiPart('name', 'user-02')
    multipartBuilder.addDataMultiPart('json', '[1,3,8,90]') // you need to convert JSON into string
    multipartBuilder.addFileMultiPart('image_file', 'C:/arrow.jpg')) // must be an absolute path
    multipartBuilder.build()
    
    var userInteraction = new UserInteraction();
    var jsHelper = new JsHelper();
    var ajaxPostMgr = new JqAjaxPostManager(); 
    ajaxPostMgr.userInteraction = userInteraction; 
    ajaxPostMgr.jsHelper = jsHelper; 
    ajaxPostMgr.performCorsAjaxPostMultiPartForm( // Note the change here
        'https://uak2020.herokuapp.com/test/postformfile',
        multipartBuilder, // this line/object has the MULTI-PART FORM POST DATA
        {
            successMessage: 'data submitted',
            successCallback: function (result, url, textStatus) {
                userInteraction.logit(result);
            },
        },
        {
            failureMessage: 'data submission error',
            failureCallback: function (textStatus, errorThrown) {
                userInteraction.logerror(errorThrown);
            },
        },
        [{name: 'origin', value: 'http://localhost'}] // Note the change here
    );

##### Example - 4 (post multi-part form data - multiple files - to live server) - method performCorsAjaxPostMultiPartForm

    var { JqAjaxPostManager, MultiPartBuilder, UserInteraction, JsHelper } = require('@uak2020/jquery-utilities');

    const multipartBuilder = new MultiPartBuilder()
    multipartBuilder.start()
    multipartBuilder.addDataMultiPart('name', 'user-11')
    multipartBuilder.addDataMultiPart('json', '[1,3,8,110]') // you need to convert JSON into string
    multipartBuilder.addFileMultiPart('image_files', 'C:/up-arrow.jpg')) // must be an absolute path and use same 1st argument
    multipartBuilder.addFileMultiPart('image_files', 'C:/down-arrow.jpg')) // must be an absolute path and use same 1st argument
    multipartBuilder.build()
    
    var userInteraction = new UserInteraction();
    var jsHelper = new JsHelper();
    var ajaxPostMgr = new JqAjaxPostManager(); 
    ajaxPostMgr.userInteraction = userInteraction; 
    ajaxPostMgr.jsHelper = jsHelper; 
    ajaxPostMgr.performCorsAjaxPostMultiPartForm( 
        'https://uak2020.herokuapp.com/test/postformfiles',
        multipartBuilder, // this line/object has the MULTI-PART FORM POST DATA
        {
            successMessage: 'data submitted',
            successCallback: function (result, url, textStatus) {
                userInteraction.logit(result);
            },
        },
        {
            failureMessage: 'data submission error',
            failureCallback: function (textStatus, errorThrown) {
                userInteraction.logerror(errorThrown);
            },
        },
        [{name: 'origin', value: 'http://localhost'}] // Note the change here
    );

##### Example - 5 (post multi-part form data - single file - to local server and receive JSON) - method performAjaxPostMultiPartFormGetJson

    var { JqAjaxPostManager, MultiPartBuilder, UserInteraction, JsHelper } = require('@uak2020/jquery-utilities');

    const multipartBuilder = new MultiPartBuilder()
    multipartBuilder.start()
    multipartBuilder.addDataMultiPart('name', 'user-03')
    multipartBuilder.addDataMultiPart('json', '[1,3,8,99]') // you need to convert JSON into string
    multipartBuilder.addFileMultiPart('file', 'C:/arrow.jpg')) // must be an absolute path
    multipartBuilder.build()
    
    var userInteraction = new UserInteraction();
    var jsHelper = new JsHelper();
    var ajaxPostMgr = new JqAjaxPostManager(); 
    ajaxPostMgr.userInteraction = userInteraction; 
    ajaxPostMgr.jsHelper = jsHelper; 
    ajaxPostMgr.performAjaxPostMultiPartFormGetJson( // Note the change here
        'http://localhost:5000/postformfileforjson',
        multipartBuilder, // this line/object has the MULTI-PART FORM POST DATA
        {
            successMessage: 'data submitted',
            successCallback: function (result, url, textStatus) {
                userInteraction.logit(result);
            },
        },
        {
            failureMessage: 'data submission error',
            failureCallback: function (textStatus, errorThrown) {
                userInteraction.logerror(errorThrown);
            },
        }
    );

The *result* parameter of *successCallback* contains the response returned by the server which is a JSON object in this case. Note that you do not need to convert *result* into JSON object.

The above example can be easily extended for multiple files upload with data fields.

##### Example - 6 (post multi-part form data - single file - to live server and receive JSON) - method performCorsAjaxPostMultiPartFormGetJson

    var { JqAjaxPostManager, MultiPartBuilder, UserInteraction, JsHelper } = require('@uak2020/jquery-utilities');

    const multipartBuilder = new MultiPartBuilder()
    multipartBuilder.start()
    multipartBuilder.addDataMultiPart('name', 'user-04')
    multipartBuilder.addDataMultiPart('json', '[1,3,8,200]') // you need to convert JSON into string
    multipartBuilder.addFileMultiPart('file', 'C:/arrow.jpg')) // must be an absolute path
    multipartBuilder.build()
    
    var userInteraction = new UserInteraction();
    var jsHelper = new JsHelper();
    var ajaxPostMgr = new JqAjaxPostManager(); 
    ajaxPostMgr.userInteraction = userInteraction; 
    ajaxPostMgr.jsHelper = jsHelper; 
    ajaxPostMgr.performCorsAjaxPostMultiPartFormGetJson( // Note the change here
        'https://uak2020.herokuapp.com/test/postformfileforjson',
        multipartBuilder, // this line/object has the MULTI-PART FORM POST DATA
        {
            successMessage: 'data submitted',
            successCallback: function (result, url, textStatus) {
                userInteraction.logit(result);
            },
        },
        {
            failureMessage: 'data submission error',
            failureCallback: function (textStatus, errorThrown) {
                userInteraction.logerror(errorThrown);
            },
        }
    );

The above example can be easily extended for multiple files upload with data fields.

###### Points to note:
- The response is a string/text when following methods are used:
    - performAjaxPostForm
    - performCorsAjaxPostForm
    - performAjaxPostMultiPartForm
    - performCorsAjaxPostMultiPartForm
- The response is a JSON object when following methods are used:
    - performAjaxPostFormGetJson
    - performCorsAjaxPostFormGetJson
    - performAjaxPostMultiPartFormGetJson
    - performCorsAjaxPostMultiPartFormGetJson

## Tests

`yarn test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.
