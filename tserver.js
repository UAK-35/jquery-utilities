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

  setUp() {
    this.app.use(cors())

    this.app.get('/test', function(req, res) {
      res.sendFile(path.join(__dirname + '/example.html'));
    });
    this.app.get('/test/json', function(req, res) {
      res.sendFile(path.join(__dirname + '/test-data.json'));
    });
    this.app.post('/test/postraw', rawBody, function(req, res) {
      res.setHeader('Content-Type', 'text/plain')
      res.write('you posted:\n')
      res.end(req.rawBody);
    });
    this.app.post('/test/postrawforjson', rawBody, function(req, res) {
      res.json({
        "method": req.method,
        "body": req.rawBody
      });
    });
    this.app.post('/test/postform', urlencodedParser, function(req, res) {
      const user_id = req.body.id;
      const token = req.body.token;
      const geo = req.body.geo;
      res.setHeader('Content-Type', 'text/plain')
      res.write('you posted:\n')
      res.end(user_id + ' ' + token + ' ' + geo);
    });
    this.app.post('/test/postformforjson', urlencodedParser, function(req, res) {
      res.json({
        "user_id": req.body.id,
        "token": req.body.token,
        "geo": req.body.geo
      });
    });
    this.app.post('/test/postjson', jsonParser, function(req, res) {
      res.json({
        "id": req.body.id,
        "mail": req.body.email,
        "fname": req.body.first_name,
        "lname": req.body.last_name,
        "avatar": req.body.avatar
      });
    });
    this.testServer = this.app.listen(PORT, function () {
      console.log(`CORS-enabled web TEST server listening on port ${ PORT }`)
    })
  }

  tearDown () {
    this.testServer.close();
    console.log("Test server terminated...");
  }
}

module.exports = TestServer;
