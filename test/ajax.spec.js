/** @format */

const {expect} = require('chai')
const path = require('path')

const {JqAjaxGetManager, JqAjaxPostManager, MultiPartBuilder, UserInteraction, JsHelper} = require('../index')
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
    testServer.setUp(__dirname + '/../test-assist')
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
            expect(errorThrown.message).to.equal('Accept header not provided or invalid')
            done()
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

    it('should successfully return html of local page - FOR TEST CASE NO MESSAGES', (done) => {
      ajaxGetMgr.performAjaxGet(
        localServerBaseUrl,
        {
          // eslint-disable-next-line no-unused-vars
          successCallback: function (result, url, textStatus) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done()
          },
        },
        {
          failureCallback: function (textStatus, errorThrown) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done(errorThrown)
          },
        }
      )
    })

    it('should successfully return html of local page - FOR TEST CASE NO CALLBACKS', (done) => {
      ajaxGetMgr.performAjaxGet(
        localServerBaseUrl,
        {
          successMessage: pageLoadSuccessMessage,
        },
        {
          failureMessage: pageLoadErrorMessage,
        }
      )
      done()
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
            expect(errorThrown.message).to.equal('Content-Type header not provided or invalid')
            done()
          },
        }
      )
    })

    it('should return error for missing POST data', (done) => {
      ajaxPostMgr.performAjaxPost(
        localServerBaseUrl,
        '',
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
            expect(errorThrown.message).to.equal('POST request has no data to send')
            done()
          },
        }
      )
    })

    it('should return error for missing POST data - NO CALLBACKS', (done) => {
      try {
        ajaxPostMgr.performAjaxPost(
          localServerBaseUrl,
          '',
          {
            successMessage: pageLoadSuccessMessage,
          },
          {
            failureMessage: pageLoadErrorMessage,
          }
        )
      } catch (e) {
        expect(e.message).to.equal('POST request has no data to send')
        done()
      }
    })

    it('should return error when builder filename and filepath point to files of different type', (done) => {
      expect(() => {
        const multipartBuilder = new MultiPartBuilder()
        multipartBuilder.start('8931976221787053863913720') // boundary exceeds test
        multipartBuilder.addDataMultiPart('name', 'user-01')
        multipartBuilder.addDataMultiPart('json', '[1,3,8,90]')
        multipartBuilder.addFileMultiPart('file', path.join(__dirname + '/../test-assist/zw.png'), 'zm.jpg')
        multipartBuilder.build()

        const uri = 'postformfile'
        ajaxPostMgr.performAjaxPostMultiPartForm(
          localServerBaseUrl + '/' + uri,
          multipartBuilder,
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
      }).to.throw(Error, 'Invalid name for file')
      done()
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

    it('should successfully post multi-part form data with single file to local server', (done) => {
      const multipartBuilder = new MultiPartBuilder()
      multipartBuilder.start()
      multipartBuilder.addDataMultiPart('name', 'user-01')
      multipartBuilder.addDataMultiPart('json', '[1,3,8,90]')
      multipartBuilder.addFileMultiPart('file', path.join(__dirname + '/../test-assist/DSC_1216.JPG'))
      multipartBuilder.build()

      // methods called again test : must have no effect
      multipartBuilder.start()
      multipartBuilder.addDataMultiPart('name', 'user-01a')
      multipartBuilder.addDataMultiPart('json', '[1,3,8,91]')
      multipartBuilder.addFileMultiPart('file', path.join(__dirname + '/../test-assist/yu.png'))
      multipartBuilder.build()

      // console.log('builder data length = ' + multipartBuilder.requestLength)
      ajaxPostMgr.performAjaxPostMultiPartForm(
        localServerBaseUrl + '/postformfile',
        multipartBuilder,
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
    }).timeout(15000)

    it('should successfully post multi-part form data with single file to local server - TEST CASE UNKNOWN EXTENSION', (done) => {
      const multipartBuilder = new MultiPartBuilder()
      multipartBuilder.start()
      multipartBuilder.addDataMultiPart('name', 'user-01b')
      multipartBuilder.addDataMultiPart('json', '[1,3,8,92]')
      multipartBuilder.addFileMultiPart('file', path.join(__dirname + '/../test-assist/unknown.extension'))
      multipartBuilder.build()

      const urlPath = 'postformfile'
      ajaxPostMgr.performAjaxPostMultiPartForm(
        localServerBaseUrl + '/' + urlPath,
        multipartBuilder,
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
    }).timeout(15000)

    it('should successfully post multi-part form data with multiple files to local server', (done) => {
      const multipartBuilder = new MultiPartBuilder()
      multipartBuilder.start()
      multipartBuilder.addDataMultiPart('name', 'user-01')
      multipartBuilder.addDataMultiPart('json', '[1,3,8,20]')
      multipartBuilder.addFileMultiPart('files', path.join(__dirname + '/../test-assist/nu.png'))
      multipartBuilder.addFileMultiPart('files', path.join(__dirname + '/../test-assist/mt.png'))
      multipartBuilder.addFileMultiPart('files', path.join(__dirname + '/../test-assist/mu.png'))
      multipartBuilder.addFileMultiPart('files', path.join(__dirname + '/../test-assist/mv.png'))
      multipartBuilder.addFileMultiPart('files', path.join(__dirname + '/../test-assist/mw.png'))
      multipartBuilder.build()

      ajaxPostMgr.performAjaxPostMultiPartForm(
        localServerBaseUrl + '/postformfiles',
        multipartBuilder,
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
    }).timeout(10000)

    it('should successfully post multi-part form data with multiple files to local server and receive json', (done) => {
      const multipartBuilder = new MultiPartBuilder()
      multipartBuilder.start()
      multipartBuilder.addDataMultiPart('name', 'user-011')
      multipartBuilder.addDataMultiPart('json', '[1,3,8,21]')
      multipartBuilder.addFileMultiPart('file', path.join(__dirname + '/../test-assist/zm.png'))
      multipartBuilder.build()

      ajaxPostMgr.performAjaxPostMultiPartFormGetJson(
        localServerBaseUrl + '/postformfileforjson',
        multipartBuilder,
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
    }).timeout(10000)

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
            // expect(errorThrown.message).to.equal('Response for preflight has invalid HTTP status code 405')
            done(errorThrown)
          },
        },
        sampleRequestOriginHeaderInfo
      )
    }).timeout(5000)

    it('should return error for cors request online - TEST CASE NO MESSAGES', (done) => {
      // expect(() => {
      ajaxGetMgr.performCorsAjaxGet(
        'https://www.google.com/',
        {
          // eslint-disable-next-line no-unused-vars
          successCallback: function (result, url, textStatus) {
            expect(textStatus).to.equal(ajaxSuccessTextStatus)
            done()
          },
        },
        {
          failureCallback: function (textStatus, errorThrown) {
            expect(textStatus).to.equal(ajaxErrorTextStatus)
            done(errorThrown)
          },
        },
        sampleRequestOriginHeaderInfo
      )
    })

    it('should return error for cors request online - TEST CASE NO CALLBACKS', (done) => {
      ajaxGetMgr.performCorsAjaxGet(
        'https://www.google.com',
        {
          successMessage: pageLoadSuccessMessage,
        },
        {
          failureMessage: pageLoadErrorMessage,
        },
        sampleRequestOriginHeaderInfo
      )
      done()
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

    it('should successfully post multi-part form data with single file to live server', (done) => {
      const multipartBuilder = new MultiPartBuilder()
      multipartBuilder.start(multipartBuilder.generateRandomNumberString(24), 'utf8')
      multipartBuilder.addDataMultiPart('name', 'user-03')
      multipartBuilder.addDataMultiPart('json', '[3,5,10,50]')
      // multipartBuilder.addFileMultiPart('image_file', path.join(__dirname + '/../test-assist/DSC_1216.JPG'))
      multipartBuilder.addFileMultiPart('image_file', path.join(__dirname + '/../test-assist/zm.png'))
      multipartBuilder.build()

      // console.log('builder data length = ' + multipartBuilder.requestLength)
      ajaxPostMgr.performCorsAjaxPostMultiPartForm(
        remoteServerBaseUrl + '/postformfile',
        multipartBuilder,
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
    }).timeout(30000)

    it('should successfully post multi-part form data with multiple files to live server', (done) => {
      const multipartBuilder = new MultiPartBuilder()
      multipartBuilder.start(multipartBuilder.generateRandomNumberString(24), 'utf8')
      multipartBuilder.addDataMultiPart('name', 'user-04')
      multipartBuilder.addDataMultiPart('json', '[4,6,11,60]')
      multipartBuilder.addFileMultiPart('image_files', path.join(__dirname + '/../test-assist/nu.png'))
      multipartBuilder.addFileMultiPart('image_files', path.join(__dirname + '/../test-assist/mt.png'))
      multipartBuilder.addFileMultiPart('image_files', path.join(__dirname + '/../test-assist/mu.png'))
      multipartBuilder.addFileMultiPart('image_files', path.join(__dirname + '/../test-assist/mv.png'))
      multipartBuilder.addFileMultiPart('image_files', path.join(__dirname + '/../test-assist/mw.png'))
      multipartBuilder.build()

      ajaxPostMgr.performCorsAjaxPostMultiPartForm(
        remoteServerBaseUrl + '/postformfiles',
        multipartBuilder,
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
    }).timeout(10000)

    it('should successfully post multi-part form data with multiple files to live server and receive json', (done) => {
      const multipartBuilder = new MultiPartBuilder()
      multipartBuilder.start()
      multipartBuilder.addDataMultiPart('name', 'user-012')
      multipartBuilder.addDataMultiPart('json', '[1,3,8,22]')
      multipartBuilder.addFileMultiPart('image_files', path.join(__dirname + '/../test-assist/yu.png'))
      multipartBuilder.addFileMultiPart('image_files', path.join(__dirname + '/../test-assist/za.png'))
      multipartBuilder.build()

      ajaxPostMgr.performCorsAjaxPostMultiPartFormGetJson(
        remoteServerBaseUrl + '/postformfilesforjson',
        multipartBuilder,
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
    }).timeout(10000)

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
