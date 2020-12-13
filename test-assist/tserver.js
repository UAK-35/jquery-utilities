const express = require('express');
const path = require('path');
const cors = require('cors')
const bodyParser = require('body-parser')

const PORT = 5000;
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();

function rawBody(req, res, next) {
  req.setEncoding('utf8');
  req.rawBody = '';
  req.on('data', function(chunk) {
    req.rawBody += chunk;
  });
  req.on('end', function(){
    next();
  });
}

class TestServer {
  app;
  testServer;

  constructor() {
    this.app = express();
  }

  _handleGetFile(filename) {
    return function (req, res) {
      res.sendFile(path.join(__dirname + '/' + filename));
    };
  }

  _handlePostRaw() {
    return function (req, res) {
      res.setHeader('Content-Type', 'text/plain')
      res.write('you posted:\n')
      res.end(req.rawBody);
    };
  }

  _handlePostRawForJson() {
    return function (req, res) {
      res.json({
        "method": req.method,
        "body": req.rawBody
      });
    };
  }

  _handlePostForm() {
    return function (req, res) {
      const user_id = req.body.id;
      const token = req.body.token;
      const geo = req.body.geo;
      res.setHeader('Content-Type', 'text/plain')
      res.write('you posted:\n')
      res.end(user_id + ' ' + token + ' ' + geo);
    };
  }

  _handlePostFormForJson() {
    return function (req, res) {
      res.json({
        "user_id": req.body.id,
        "token": req.body.token,
        "geo": req.body.geo
      });
    };
  }

  _handlePostJson() {
    return function (req, res) {
      res.json({
        "id": req.body.id,
        "mail": req.body.email,
        "fname": req.body.first_name,
        "lname": req.body.last_name,
        "avatar": req.body.avatar
      });
    };
  }

  _onListenStart() {
    return function () {
      console.log(`CORS-enabled web TEST server listening on port ${PORT}`)
    };
  }

  setUp() {
    this.app.use(cors())
    this.app.get('/test', this._handleGetFile('example.html'));
    this.app.get('/test/json', this._handleGetFile('test-data.json'));
    this.app.post('/test/postraw', rawBody, this._handlePostRaw());
    this.app.post('/test/postrawforjson', rawBody, this._handlePostRawForJson());
    this.app.post('/test/postform', urlencodedParser, this._handlePostForm());
    this.app.post('/test/postformforjson', urlencodedParser, this._handlePostFormForJson());
    this.app.post('/test/postjson', jsonParser, this._handlePostJson());
    this.testServer = this.app.listen(PORT, this._onListenStart())
  }

  tearDown () {
    this.testServer.close();
    console.log("Test server terminated...");
  }
}

module.exports = TestServer;
