const { expect } = require('chai');

const { JqAjaxManager, UserInteraction, JsHelper } = require('../index');
const TestServer = require("../test-assist/tserver");

describe('suite for local server AJAX tests', function () {

  let ajaxMgr;
  const testServer = new TestServer();

  before(function () {
    testServer.setUp();
  });
  beforeEach(function () {
    ajaxMgr = new JqAjaxManager();
    ajaxMgr.userInteraction = new UserInteraction();
    ajaxMgr.jsHelper = new JsHelper();
  });
  after(function () {
    testServer.tearDown();
  });

  it('should successfully return html of local page', function (done) {
    ajaxMgr.performAjaxGet(
      'http://localhost:5000/test',
      {
        successMessage: 'page loaded',
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success');
          done();
        }
      },
      {
        failureMessage: 'page load error',
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('success');
          done(errorThrown);
        }
      }
    );
  });

  it('should successfully return data from local JSON file', function (done) {
    ajaxMgr.performAjaxGetJson(
      'http://localhost:5000/test/json',
      {
        successMessage: 'json loaded',
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success');
          done();
        }
      },
      {
        failureMessage: 'json load error',
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('success');
          done(errorThrown);
        }
      }
    );
  });

  it('should successfully post text data to local server', function (done) {
    ajaxMgr.performAjaxPost(
      'http://localhost:5000/test/postraw',
      'id|4+token|sdfa3+geo|us',
      {
        successMessage: 'data submitted',
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success');
          done();
        }
      },
      {
        failureMessage: 'data submission error',
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('success');
          done(errorThrown);
        }
      }
    );
  });

  it('should successfully post text data to local server and receive json', function (done) {
    ajaxMgr.performAjaxPostGetJson(
      'http://localhost:5000/test/postrawforjson',
      'id|4+token|sdfa3+geo|us',
      {
        successMessage: 'data submitted',
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success');
          done();
        }
      },
      {
        failureMessage: 'data submission error',
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('success');
          done(errorThrown);
        }
      }
    );
  });

  it('should successfully post form data to local server', function (done) {
    ajaxMgr.performAjaxPostForm(
      'http://localhost:5000/test/postform',
      'id=4&token=sdfa3&geo=us',
      {
        successMessage: 'data submitted',
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success');
          done();
        }
      },
      {
        failureMessage: 'data submission error',
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('success');
          done(errorThrown);
        }
      }
    );
  });

  it('should successfully post form data to local server and receive json', function (done) {
    ajaxMgr.performAjaxPostFormGetJson(
      'http://localhost:5000/test/postformforjson',
      'id=4&token=sdfa3&geo=us',
      {
        successMessage: 'data submitted',
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success');
          done();
        }
      },
      {
        failureMessage: 'data submission error',
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('success');
          done(errorThrown);
        }
      }
    );
  });

  it('should successfully post JSON data to local server', function (done) {
    const postData = '{"id": 1, "email": "test.mail@example.com", "first_name": "Test", "last_name": "User", "avatar": "https://reqres.in/img/faces/2-image.jpg"}';
    ajaxMgr.performAjaxPostJson(
      'http://localhost:5000/test/postjson',
      postData,
      {
        successMessage: 'json submitted',
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success');
          done();
        }
      },
      {
        failureMessage: 'json submission error',
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('success');
          done(errorThrown);
        }
      }
    );
  });

});



describe('suite for cross domain live server AJAX tests', function () {

  let ajaxMgr;

  beforeEach(function () {
    ajaxMgr = new JqAjaxManager();
    ajaxMgr.userInteraction = new UserInteraction();
    ajaxMgr.jsHelper = new JsHelper();
  });

  it('should return error for cors request online', function (done) {
    ajaxMgr.performCrossDomainAjaxGet(
      'https://www.google.com/',
      {
        successMessage: 'page loaded',
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success');
          done();
        }
      },
      {
        failureMessage: 'page load error',
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('error');
          done(errorThrown);
        }
      },
      [
        {name: 'origin', value: 'http://localhost'},
      ]
    );
  });

  it('should successfully return html of an online page', function (done) {
    ajaxMgr.performCrossDomainAjaxGet(
      'https://uak2020.herokuapp.com/test',
      {
        successMessage: 'page loaded',
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success');
          done();
        }
      },
      {
        failureMessage: 'page load error',
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('success');
          done(errorThrown);
        }
      },
      [
        {name: 'origin', value: 'http://localhost'},
      ]
    );
  });

  it('should successfully return json present at given uri online', function (done) {
    ajaxMgr.performCrossDomainAjaxGetJson(
      'https://uak2020.herokuapp.com/test/json',
      {
        successMessage: 'json loaded',
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success');
          done();
        }
      },
      {
        failureMessage: 'json load error',
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('success');
          done(errorThrown);
        }
      },
      [
        {name: 'origin', value: 'http://localhost'},
      ]
    );
  });

  it('should successfully post text data to live server', function (done) {
    ajaxMgr.performCrossDomainAjaxPost(
      'https://uak2020.herokuapp.com/test/postraw',
      'id|4+token|sdfa3+geo|us',
      {
        successMessage: 'data submitted',
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success');
          done();
        }
      },
      {
        failureMessage: 'data submission error',
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('success');
          done(errorThrown);
        }
      },
      [
        {name: 'origin', value: 'http://localhost'},
      ]
    );
  });

  it('should successfully post text data to live server and receive json', function (done) {
    ajaxMgr.performCrossDomainAjaxPostGetJson(
      'https://uak2020.herokuapp.com/test/postrawforjson',
      'id|4+token|sdfa3+geo|us',
      {
        successMessage: 'data submitted',
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success');
          done();
        }
      },
      {
        failureMessage: 'data submission error',
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('success');
          done(errorThrown);
        }
      },
      [
        {name: 'origin', value: 'http://localhost'},
      ]
    );
  });

  it('should successfully post form data to live server', function (done) {
    ajaxMgr.performCrossDomainAjaxPostForm(
      'https://uak2020.herokuapp.com/test/postform',
      'id=4&token=sdfa3&geo=us',
      {
        successMessage: 'data submitted',
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success');
          done();
        }
      },
      {
        failureMessage: 'data submission error',
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('success');
          done(errorThrown);
        }
      },
      [
        {name: 'origin', value: 'http://localhost'},
      ]
    );
  });

  it('should successfully post form data to live server and receive json', function (done) {
    ajaxMgr.performCrossDomainAjaxPostFormGetJson(
      'https://uak2020.herokuapp.com/test/postformforjson',
      'id=4&token=sdfa3&geo=us',
      {
        successMessage: 'data submitted',
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success');
          done();
        }
      },
      {
        failureMessage: 'data submission error',
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('success');
          done(errorThrown);
        }
      },
      [
        {name: 'origin', value: 'http://localhost'},
      ]
    );
  });

  it('should successfully post JSON data to live server', function (done) {
    const postData = '{"id": 1, "email": "test.mail@example.com", "first_name": "Test", "last_name": "User", "avatar": "https://reqres.in/img/faces/2-image.jpg"}';
    ajaxMgr.performCrossDomainAjaxPostJson(
      'https://uak2020.herokuapp.com/test/postjson',
      postData,
      {
        successMessage: 'json submitted',
        successCallback: function (result, url, textStatus) {
          expect(textStatus).to.equal('success');
          done();
        }
      },
      {
        failureMessage: 'json submission error',
        failureCallback: function (textStatus, errorThrown) {
          expect(textStatus).to.equal('success');
          done(errorThrown);
        }
      },
      [
        {name: 'origin', value: 'http://localhost'},
      ]
    );
  });

});
