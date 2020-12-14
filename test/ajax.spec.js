/** @format */

const {expect} = require('chai')

const {JqAjaxManager, UserInteraction, JsHelper} = require('../index')
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

function createAjaxManager() {
  const ajaxManager = new JqAjaxManager()
  ajaxManager.userInteraction = new UserInteraction()
  ajaxManager.jsHelper = new JsHelper()
  return ajaxManager
}

describe('suite for local server AJAX tests', () => {
  let ajaxMgr
  const testServer = new TestServer()

  before(() => {
    testServer.setUp()
  })
  beforeEach(() => {
    ajaxMgr = createAjaxManager()
  })
  after(() => {
    testServer.tearDown()
  })

  it('should return error for invalid/missing request-response accept header', (done) => {
    ajaxMgr.performAjaxInvalid(
      localServerBaseUrl,
      {
        successMessage: pageLoadSuccessMessage,
        // eslint-disable-next-line no-unused-vars
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success')
          done()
        },
      },
      {
        failureMessage: pageLoadErrorMessage,
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('error')
          done(errorThrown)
        },
      }
    )
  })

  it('should successfully return html of local page', (done) => {
    ajaxMgr.performAjaxGet(
      localServerBaseUrl,
      {
        successMessage: pageLoadSuccessMessage,
        // eslint-disable-next-line no-unused-vars
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success')
          done()
        },
      },
      {
        failureMessage: pageLoadErrorMessage,
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('success')
          done(errorThrown)
        },
      }
    )
  })

  it('should successfully return data from local JSON file', (done) => {
    ajaxMgr.performAjaxGetJson(
      localServerBaseUrl + '/json',
      {
        successMessage: 'json loaded',
        // eslint-disable-next-line no-unused-vars
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success')
          done()
        },
      },
      {
        failureMessage: 'json load error',
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('success')
          done(errorThrown)
        },
      }
    )
  })

  it('should return error for invalid/missing request-response accept header or request content type header', (done) => {
    ajaxMgr.performAjaxPostInvalid(
      localServerBaseUrl,
      rawSampleStringToPost,
      {
        successMessage: pageLoadSuccessMessage,
        // eslint-disable-next-line no-unused-vars
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success')
          done()
        },
      },
      {
        failureMessage: pageLoadErrorMessage,
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('error')
          done(errorThrown)
        },
      }
    )
  })

  it('should successfully post text data to local server', (done) => {
    ajaxMgr.performAjaxPost(
      localServerBaseUrl + '/postraw',
      rawSampleStringToPost,
      {
        successMessage: dataSubmissionSuccessMessage,
        // eslint-disable-next-line no-unused-vars
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success')
          done()
        },
      },
      {
        failureMessage: dataSubmissionErrorMessage,
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('success')
          done(errorThrown)
        },
      }
    )
  })

  it('should successfully post text data to local server and receive json', (done) => {
    ajaxMgr.performAjaxPostGetJson(
      localServerBaseUrl + '/postrawforjson',
      rawSampleStringToPost,
      {
        successMessage: dataSubmissionSuccessMessage,
        // eslint-disable-next-line no-unused-vars
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success')
          done()
        },
      },
      {
        failureMessage: dataSubmissionErrorMessage,
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('success')
          done(errorThrown)
        },
      }
    )
  })

  it('should successfully post form data to local server', (done) => {
    ajaxMgr.performAjaxPostForm(
      localServerBaseUrl + '/postform',
      sampleFormDataStringToPost,
      {
        successMessage: dataSubmissionSuccessMessage,
        // eslint-disable-next-line no-unused-vars
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success')
          done()
        },
      },
      {
        failureMessage: dataSubmissionErrorMessage,
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('success')
          done(errorThrown)
        },
      }
    )
  })

  it('should successfully post form data to local server and receive json', (done) => {
    ajaxMgr.performAjaxPostFormGetJson(
      localServerBaseUrl + '/postformforjson',
      sampleFormDataStringToPost,
      {
        successMessage: dataSubmissionSuccessMessage,
        // eslint-disable-next-line no-unused-vars
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success')
          done()
        },
      },
      {
        failureMessage: dataSubmissionErrorMessage,
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('success')
          done(errorThrown)
        },
      }
    )
  })

  it('should successfully post JSON data to local server', (done) => {
    const postData = '{"id": 1, "email": "test.mail@example.com", "first_name": "Test", "last_name": "User", "avatar": "https://reqres.in/img/faces/2-image.jpg"}'
    ajaxMgr.performAjaxPostJson(
      localServerBaseUrl + '/postjson',
      postData,
      {
        successMessage: 'json submitted',
        // eslint-disable-next-line no-unused-vars
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success')
          done()
        },
      },
      {
        failureMessage: 'json submission error',
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('success')
          done(errorThrown)
        },
      }
    )
  })
})

describe('suite for cross domain live server AJAX tests', () => {
  let ajaxMgr

  beforeEach(() => {
    ajaxMgr = createAjaxManager()
  })

  it('should return error for cors request online', (done) => {
    ajaxMgr.performCorsAjaxGet(
      'https://www.google.com/',
      {
        successMessage: pageLoadSuccessMessage,
        // eslint-disable-next-line no-unused-vars
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success')
          done()
        },
      },
      {
        failureMessage: pageLoadErrorMessage,
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('error')
          done(errorThrown)
        },
      },
      sampleRequestOriginHeaderInfo
    )
  })

  it('should successfully return html of an online page', (done) => {
    ajaxMgr.performCorsAjaxGet(
      remoteServerBaseUrl,
      {
        successMessage: pageLoadSuccessMessage,
        // eslint-disable-next-line no-unused-vars
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success')
          done()
        },
      },
      {
        failureMessage: pageLoadErrorMessage,
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('success')
          done(errorThrown)
        },
      },
      sampleRequestOriginHeaderInfo
    )
  })

  it('should successfully return json present at given uri online', (done) => {
    ajaxMgr.performCorsAjaxGetJson(
      remoteServerBaseUrl + '/json',
      {
        successMessage: 'json loaded',
        // eslint-disable-next-line no-unused-vars
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success')
          done()
        },
      },
      {
        failureMessage: 'json load error',
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('success')
          done(errorThrown)
        },
      },
      sampleRequestOriginHeaderInfo
    )
  })

  it('should successfully post text data to live server', (done) => {
    ajaxMgr.performCorsAjaxPost(
      remoteServerBaseUrl + '/postraw',
      rawSampleStringToPost,
      {
        successMessage: dataSubmissionSuccessMessage,
        // eslint-disable-next-line no-unused-vars
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success')
          done()
        },
      },
      {
        failureMessage: dataSubmissionErrorMessage,
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('success')
          done(errorThrown)
        },
      },
      sampleRequestOriginHeaderInfo
    )
  })

  it('should successfully post text data to live server and receive json', (done) => {
    ajaxMgr.performCorsAjaxPostGetJson(
      remoteServerBaseUrl + '/postrawforjson',
      rawSampleStringToPost,
      {
        successMessage: dataSubmissionSuccessMessage,
        // eslint-disable-next-line no-unused-vars
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success')
          done()
        },
      },
      {
        failureMessage: dataSubmissionErrorMessage,
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('success')
          done(errorThrown)
        },
      },
      sampleRequestOriginHeaderInfo
    )
  })

  it('should successfully post form data to live server', (done) => {
    ajaxMgr.performCorsAjaxPostForm(
      remoteServerBaseUrl + '/postform',
      sampleFormDataStringToPost,
      {
        successMessage: dataSubmissionSuccessMessage,
        // eslint-disable-next-line no-unused-vars
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success')
          done()
        },
      },
      {
        failureMessage: dataSubmissionErrorMessage,
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('success')
          done(errorThrown)
        },
      },
      sampleRequestOriginHeaderInfo
    )
  })

  it('should successfully post form data to live server and receive json', (done) => {
    ajaxMgr.performCorsAjaxPostFormGetJson(
      remoteServerBaseUrl + '/postformforjson',
      sampleFormDataStringToPost,
      {
        successMessage: dataSubmissionSuccessMessage,
        // eslint-disable-next-line no-unused-vars
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success')
          done()
        },
      },
      {
        failureMessage: dataSubmissionErrorMessage,
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('success')
          done(errorThrown)
        },
      },
      sampleRequestOriginHeaderInfo
    )
  })

  it('should successfully post JSON data to live server', (done) => {
    const postData = {id: 1, email: 'test.mail@example.com', first_name: 'Test', last_name: 'User', avatar: 'https://reqres.in/img/faces/2-image.jpg'}
    ajaxMgr.performCorsAjaxPostJson(
      remoteServerBaseUrl + '/postjson',
      postData,
      {
        successMessage: 'json submitted',
        // eslint-disable-next-line no-unused-vars
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success')
          done()
        },
      },
      {
        failureMessage: 'json submission error',
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('success')
          done(errorThrown)
        },
      },
      sampleRequestOriginHeaderInfo
    )
  })
})
