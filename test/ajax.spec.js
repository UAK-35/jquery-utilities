/** @format */

const {expect} = require('chai')

const {JqAjaxGetManager, JqAjaxPostManager, UserInteraction, JsHelper} = require('../index')
const TestServer = require('../test-assist/tserver')

const pageLoadSuccessMessage = 'page loaded'
const pageLoadErrorMessage = 'page load error'
const localServerBaseUrl = 'http://localhost:5000/test'
const rawSampleStringToPost = 'id|4+token|NULL-TOKEN3+geo|us'
const dataSubmissionSuccessMessage = 'data submitted'
const dataSubmissionErrorMessage = 'data submission error'
const sampleFormDataStringToPost = 'id=4&token=NULL-TOKEN3&geo=us'
const sampleRequestOriginHeaderInfo = [{name: 'origin', value: 'http://localhost'}]
const remoteServerBaseUrl = 'https://uak2020.herokuapp.com/test'
const ajaxSuccessTextStatus = 'success'
const ajaxErrorTextStatus = 'error'

function createAjaxGetManager() {
  const ajaxManager = new JqAjaxGetManager()
  ajaxManager.userInteraction = new UserInteraction()
  ajaxManager.jsHelper = new JsHelper()
  return ajaxManager
}

function createAjaxPostManager() {
  const ajaxManager = new JqAjaxPostManager()
  ajaxManager.userInteraction = new UserInteraction()
  ajaxManager.jsHelper = new JsHelper()
  return ajaxManager
}

describe('suite for local server AJAX request tests', () => {
  const testServer = new TestServer()

  before(() => {
    testServer.setUp()
  })
  after(() => {
    testServer.tearDown()
  })

  describe('suite for local server AJAX GET request tests', () => {
    let ajaxGetMgr
    beforeEach(() => {
      ajaxGetMgr = createAjaxGetManager()
    })

    it('should return error for invalid/missing request-response accept header', (done) => {
      ajaxGetMgr.performAjaxInvalid(
        localServerBaseUrl,
        {
          successMessage: pageLoadSuccessMessage,
          // eslint-disable-next-line no-unused-vars
          successCallback: function (result, url, textStatus) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done()
          },
        },
        {
          failureMessage: pageLoadErrorMessage,
          failureCallback: function (textStatus, errorThrown) {
            expect(textStatus).to.equal(ajaxErrorTextStatus)
            done(errorThrown)
          },
        }
      )
    })

    it('should successfully return html of local page', (done) => {
      ajaxGetMgr.performAjaxGet(
        localServerBaseUrl,
        {
          successMessage: pageLoadSuccessMessage,
          // eslint-disable-next-line no-unused-vars
          successCallback: function (result, url, textStatus) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done()
          },
        },
        {
          failureMessage: pageLoadErrorMessage,
          failureCallback: function (textStatus, errorThrown) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done(errorThrown)
          },
        }
      )
    })

    it('should successfully return data from local JSON file', (done) => {
      ajaxGetMgr.performAjaxGetJson(
        localServerBaseUrl + '/json',
        {
          successMessage: 'json loaded',
          // eslint-disable-next-line no-unused-vars
          successCallback: function (result, url, textStatus) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done()
          },
        },
        {
          failureMessage: 'json load error',
          failureCallback: function (textStatus, errorThrown) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done(errorThrown)
          },
        }
      )
    })
  })

  describe('suite for local server AJAX POST request tests', () => {
    let ajaxPostMgr
    beforeEach(() => {
      ajaxPostMgr = createAjaxPostManager()
    })

    it('should return error for invalid/missing request-response accept header or request content type header', (done) => {
      ajaxPostMgr.performAjaxPostInvalid(
        localServerBaseUrl,
        rawSampleStringToPost,
        {
          successMessage: pageLoadSuccessMessage,
          // eslint-disable-next-line no-unused-vars
          successCallback: function (result, url, textStatus) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done()
          },
        },
        {
          failureMessage: pageLoadErrorMessage,
          failureCallback: function (textStatus, errorThrown) {
            expect(textStatus).to.equal(ajaxErrorTextStatus)
            done(errorThrown)
          },
        }
      )
    })

    it('should successfully post text data to local server', (done) => {
      ajaxPostMgr.performAjaxPost(
        localServerBaseUrl + '/postraw',
        rawSampleStringToPost,
        {
          successMessage: dataSubmissionSuccessMessage,
          // eslint-disable-next-line no-unused-vars
          successCallback: function (result, url, textStatus) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done()
          },
        },
        {
          failureMessage: dataSubmissionErrorMessage,
          failureCallback: function (textStatus, errorThrown) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done(errorThrown)
          },
        }
      )
    })

    it('should successfully post text data to local server and receive json', (done) => {
      ajaxPostMgr.performAjaxPostGetJson(
        localServerBaseUrl + '/postrawforjson',
        rawSampleStringToPost,
        {
          successMessage: dataSubmissionSuccessMessage,
          // eslint-disable-next-line no-unused-vars
          successCallback: function (result, url, textStatus) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done()
          },
        },
        {
          failureMessage: dataSubmissionErrorMessage,
          failureCallback: function (textStatus, errorThrown) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done(errorThrown)
          },
        }
      )
    })

    it('should successfully post form data to local server', (done) => {
      ajaxPostMgr.performAjaxPostForm(
        localServerBaseUrl + '/postform',
        sampleFormDataStringToPost,
        {
          successMessage: dataSubmissionSuccessMessage,
          // eslint-disable-next-line no-unused-vars
          successCallback: function (result, url, textStatus) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done()
          },
        },
        {
          failureMessage: dataSubmissionErrorMessage,
          failureCallback: function (textStatus, errorThrown) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done(errorThrown)
          },
        }
      )
    })

    it('should successfully post form data to local server and receive json', (done) => {
      ajaxPostMgr.performAjaxPostFormGetJson(
        localServerBaseUrl + '/postformforjson',
        sampleFormDataStringToPost,
        {
          successMessage: dataSubmissionSuccessMessage,
          // eslint-disable-next-line no-unused-vars
          successCallback: function (result, url, textStatus) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done()
          },
        },
        {
          failureMessage: dataSubmissionErrorMessage,
          failureCallback: function (textStatus, errorThrown) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done(errorThrown)
          },
        }
      )
    })

    it('should successfully post JSON data to local server', (done) => {
      const postData = '{"id": 1, "email": "test.mail@example.com", "first_name": "Test", "last_name": "User", "avatar": "https://reqres.in/img/faces/2-image.jpg"}'
      ajaxPostMgr.performAjaxPostJson(
        localServerBaseUrl + '/postjson',
        postData,
        {
          successMessage: 'json submitted',
          // eslint-disable-next-line no-unused-vars
          successCallback: function (result, url, textStatus) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done()
          },
        },
        {
          failureMessage: 'json submission error',
          failureCallback: function (textStatus, errorThrown) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done(errorThrown)
          },
        }
      )
    })
  })
})

describe('suite for cross domain live server AJAX tests', () => {
  describe('suite for cross domain live server AJAX GET request tests', () => {
    let ajaxGetMgr
    beforeEach(() => {
      ajaxGetMgr = createAjaxGetManager()
    })
    it('should return error for cors request online', (done) => {
      ajaxGetMgr.performCorsAjaxGet(
        'https://www.google.com/',
        {
          successMessage: pageLoadSuccessMessage,
          // eslint-disable-next-line no-unused-vars
          successCallback: function (result, url, textStatus) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done()
          },
        },
        {
          failureMessage: pageLoadErrorMessage,
          failureCallback: function (textStatus, errorThrown) {
            expect(textStatus).to.equal(ajaxErrorTextStatus)
            done(errorThrown)
          },
        },
        sampleRequestOriginHeaderInfo
      )
    })

    it('should successfully return html of an online page', (done) => {
      ajaxGetMgr.performCorsAjaxGet(
        remoteServerBaseUrl,
        {
          successMessage: pageLoadSuccessMessage,
          // eslint-disable-next-line no-unused-vars
          successCallback: function (result, url, textStatus) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done()
          },
        },
        {
          failureMessage: pageLoadErrorMessage,
          failureCallback: function (textStatus, errorThrown) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done(errorThrown)
          },
        },
        sampleRequestOriginHeaderInfo
      )
    })

    it('should successfully return json present at given uri online', (done) => {
      ajaxGetMgr.performCorsAjaxGetJson(
        remoteServerBaseUrl + '/json',
        {
          successMessage: 'json loaded',
          // eslint-disable-next-line no-unused-vars
          successCallback: function (result, url, textStatus) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done()
          },
        },
        {
          failureMessage: 'json load error',
          failureCallback: function (textStatus, errorThrown) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done(errorThrown)
          },
        },
        sampleRequestOriginHeaderInfo
      )
    })
  })

  describe('suite for cross domain live server AJAX POST request tests', () => {
    let ajaxPostMgr
    beforeEach(() => {
      ajaxPostMgr = createAjaxPostManager()
    })
    it('should successfully post text data to live server', (done) => {
      ajaxPostMgr.performCorsAjaxPost(
        remoteServerBaseUrl + '/postraw',
        rawSampleStringToPost,
        {
          successMessage: dataSubmissionSuccessMessage,
          // eslint-disable-next-line no-unused-vars
          successCallback: function (result, url, textStatus) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done()
          },
        },
        {
          failureMessage: dataSubmissionErrorMessage,
          failureCallback: function (textStatus, errorThrown) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done(errorThrown)
          },
        },
        sampleRequestOriginHeaderInfo
      )
    })

    it('should successfully post text data to live server and receive json', (done) => {
      ajaxPostMgr.performCorsAjaxPostGetJson(
        remoteServerBaseUrl + '/postrawforjson',
        rawSampleStringToPost,
        {
          successMessage: dataSubmissionSuccessMessage,
          // eslint-disable-next-line no-unused-vars
          successCallback: function (result, url, textStatus) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done()
          },
        },
        {
          failureMessage: dataSubmissionErrorMessage,
          failureCallback: function (textStatus, errorThrown) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done(errorThrown)
          },
        },
        sampleRequestOriginHeaderInfo
      )
    })

    it('should successfully post form data to live server', (done) => {
      ajaxPostMgr.performCorsAjaxPostForm(
        remoteServerBaseUrl + '/postform',
        sampleFormDataStringToPost,
        {
          successMessage: dataSubmissionSuccessMessage,
          // eslint-disable-next-line no-unused-vars
          successCallback: function (result, url, textStatus) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done()
          },
        },
        {
          failureMessage: dataSubmissionErrorMessage,
          failureCallback: function (textStatus, errorThrown) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done(errorThrown)
          },
        },
        sampleRequestOriginHeaderInfo
      )
    })

    it('should successfully post form data to live server and receive json', (done) => {
      ajaxPostMgr.performCorsAjaxPostFormGetJson(
        remoteServerBaseUrl + '/postformforjson',
        sampleFormDataStringToPost,
        {
          successMessage: dataSubmissionSuccessMessage,
          // eslint-disable-next-line no-unused-vars
          successCallback: function (result, url, textStatus) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done()
          },
        },
        {
          failureMessage: dataSubmissionErrorMessage,
          failureCallback: function (textStatus, errorThrown) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done(errorThrown)
          },
        },
        sampleRequestOriginHeaderInfo
      )
    })

    it('should successfully post JSON data to live server', (done) => {
      const postData = {id: 1, email: 'test.mail@example.com', first_name: 'Test', last_name: 'User', avatar: 'https://reqres.in/img/faces/2-image.jpg'}
      ajaxPostMgr.performCorsAjaxPostJson(
        remoteServerBaseUrl + '/postjson',
        postData,
        {
          successMessage: 'json submitted',
          // eslint-disable-next-line no-unused-vars
          successCallback: function (result, url, textStatus) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done()
          },
        },
        {
          failureMessage: 'json submission error',
          failureCallback: function (textStatus, errorThrown) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done(errorThrown)
          },
        },
        sampleRequestOriginHeaderInfo
      )
    })
  })
})
