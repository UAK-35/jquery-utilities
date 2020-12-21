/** @format */

const express = require('express')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const multer = require('multer')
const fs = require('fs')
const onDeath = require('death')

const PORT = 5000
const urlencodedParser = bodyParser.urlencoded({extended: false})
const jsonParser = bodyParser.json()

const multerSingleUploadMem = multer({storage: multer.memoryStorage({})})

// eslint-disable-next-line no-unused-vars
function rawBody(req, res, next) {
  req.setEncoding('utf8')
  req.rawBody = ''
  req.on('data', (chunk) => {
    req.rawBody += chunk
  })
  req.on('end', () => {
    next()
  })
}

const CONTENT_TYPE_HEADER_KEY = 'Content-Type'

class TestServer {
  parentFolder
  app
  testServer
  offDeath

  constructor() {
    this.app = express()
  }

  _handleGetFile(filename) {
    const $this = this
    // eslint-disable-next-line no-unused-vars
    return function (req, res) {
      res.sendFile(path.join($this.parentFolder, '/' + filename))
    }
  }

  _handlePostRaw() {
    return function (req, res) {
      res.setHeader(CONTENT_TYPE_HEADER_KEY, 'text/plain')
      res.write('you posted:\n')
      res.end(req.rawBody)
    }
  }

  _returnJson(res, jsonObj) {
    res.setHeader(CONTENT_TYPE_HEADER_KEY, 'application/json')
    res.status(200).end(JSON.stringify(jsonObj))
  }

  _handlePostRawForJson() {
    const $this = this
    return function (req, res) {
      $this._returnJson(res, {
        method: req.method,
        body: req.rawBody,
      })
    }
  }

  _handlePostForm() {
    return function (req, res) {
      const userId = req.body.id
      const token = req.body.token
      const geo = req.body.geo
      res.setHeader(CONTENT_TYPE_HEADER_KEY, 'text/plain')
      res.write('you posted:\n')
      res.end(userId + ' ' + token + ' ' + geo)
    }
  }

  _handlePostFormForJson() {
    const $this = this
    return function (req, res) {
      $this._returnJson(res, {
        user_id: req.body.id,
        token: req.body.token,
        geo: req.body.geo,
      })
    }
  }

  _responseError(next, errorMessage) {
    const error = new Error(errorMessage)
    error.httpStatusCode = 400
    return next(error)
  }

  _writeImage(file) {
    const raw = Buffer.from(file.buffer.toString(), 'base64')
    return new Promise((resolve) => {
      // let error = null
      fs.writeFile(path.join(this.parentFolder, '/uploads/') + Date.now() + '_' + file.originalname, raw, (err) => {
        if (err) {
          console.error('ERROR: ' + err)
          // error = err
          resolve(false)
        }
        resolve(true)
      })
      // resolve(false)
    })
  }

  _handlePostMultipartFormSingleFile() {
    const $this = this
    return function (req, res, next) {
      console.log('body = ' + JSON.stringify(req.body))
      if (!req.file) return $this._responseError(next, 'Please select an image to upload')
      $this._writeImage(req.file).then((success) => {
        if (success) res.end('Success!')
        else res.end('Failed!')
      })
      // if (success) res.end('Success!')
      // // else return next(err)
      // else res.end('Failed!')
      // // const raw = Buffer.from(req.file.buffer.toString(), 'base64')
      // // fs.writeFile('./uploads/' + Date.now() + '_' + req.file.originalname, raw, (err) => {
      // //   if (err) return next(err)
      // //   res.end('Success!')
      // // })
    }
  }

  _handlePostMultipartFormSingleFileForJson() {
    const $this = this
    return function (req, res, next) {
      console.log('body = ' + JSON.stringify(req.body))
      if (!req.file) return $this._responseError(next, 'Please select an image to upload')
      let successStatus = false
      $this._writeImage(req.file).then((success) => {
        successStatus = success
        $this._returnJson(res, {
          status: successStatus ? 'Success!' : 'Failed!',
          name: req.body.name,
          json: JSON.parse(req.body.json),
        })
      })
    }
  }

  _handlePostMultipartFormMultipleFiles() {
    const $this = this
    return async function (req, res, next) {
      console.log('body = ' + JSON.stringify(req.body))
      if (!req.files) return $this._responseError(next, 'Please choose files')
      let failedFilenames = []
      for (let file of req.files) if (!(await $this._writeImage(file))) failedFilenames.push(file.originalname)
      if (failedFilenames.length === 0) {
        res.end('Success!')
        return
      }
      return $this._responseError(next, failedFilenames.length + ' file(s) upload failed > ' + JSON.stringify(failedFilenames))
    }
  }

  _handlePostMultipartFormMultipleFilesForJson() {
    const $this = this
    // eslint-disable-next-line sonarjs/cognitive-complexity
    return async function (req, res, next) {
      console.log('body = ' + JSON.stringify(req.body))
      if (!req.files) return $this._responseError(next, 'Please choose files')
      let failedFilenames = []
      for (let file of req.files) if (!(await $this._writeImage(file))) failedFilenames.push(file.originalname)
      const successStatus = failedFilenames.length === 0
      const returnJson = {
        name: req.body.name,
        json: JSON.parse(req.body.json),
      }
      if (successStatus) {
        returnJson.status = 'Success!'
      } else {
        returnJson.status = 'Failed!'
        returnJson.failureText = failedFilenames.length + ' file(s) upload failed > ' + JSON.stringify(failedFilenames)
      }
      $this._returnJson(res, returnJson)
    }
  }

  _handlePostJson() {
    const $this = this
    return function (req, res) {
      $this._returnJson(res, {
        id: req.body.id,
        mail: req.body.email,
        fname: req.body.first_name,
        lname: req.body.last_name,
        avatar: req.body.avatar,
      })
    }
  }

  _onListenStart() {
    return function () {
      console.log(`CORS-enabled web TEST server listening on port ${PORT}`)
    }
  }

  setUp(currentFolder) {
    this.parentFolder = currentFolder
    const uploadFolder = path.join(this.parentFolder, '/uploads/')
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder)
    }

    // eslint-disable-next-line no-unused-vars
    this.offDeath = onDeath((signal, err) => {
      // clean up code below
      this.tearDown()
    })

    this.app.use(cors())
    this.app.get('/test', this._handleGetFile('example.html'))
    this.app.get('/test/json', this._handleGetFile('test-data.json'))
    this.app.post('/test/postraw', rawBody, this._handlePostRaw())
    this.app.post('/test/postrawforjson', rawBody, this._handlePostRawForJson())
    this.app.post('/test/postform', urlencodedParser, this._handlePostForm())
    this.app.post('/test/postformforjson', urlencodedParser, this._handlePostFormForJson())
    this.app.post('/test/postformfile', multerSingleUploadMem.single('file'), this._handlePostMultipartFormSingleFile())
    this.app.post('/test/postformfileforjson', multerSingleUploadMem.single('file'), this._handlePostMultipartFormSingleFileForJson())
    this.app.post('/test/postformfiles', multerSingleUploadMem.array('files', 5), this._handlePostMultipartFormMultipleFiles())
    this.app.post('/test/postformfilesforjson', multerSingleUploadMem.array('files', 5), this._handlePostMultipartFormMultipleFilesForJson())
    this.app.post('/test/postjson', jsonParser, this._handlePostJson())
    this.testServer = this.app.listen(PORT, this._onListenStart())
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  tearDown() {
    if (this.testServer) {
      this.testServer.close()
      console.log('Test server terminated...')
      const uploadFolder = path.join(this.parentFolder, '/uploads/')
      fs.readdir(uploadFolder, (err, files) => {
        if (err) throw err
        for (const file of files) {
          fs.unlink(path.join(uploadFolder, file), (err) => {
            if (err) throw err
          })
          console.log('All temporary files deleted...')
        }
      })
      this.testServer = null
    }
  }
}

module.exports = TestServer
