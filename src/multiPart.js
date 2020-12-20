/** @format */

const fs = require('fs')
const path = require('path')
const mime = require('mime-types')

class MultiPartBuilder {
  _separator = '$&'
  _boundarySeparator = '--'
  _boundaryPrefix = '----------------------------'
  _multipartBoundary = '----------------------------065728335850446694108967'
  _doubleQuote = '"'
  _keyValueSeparator = ': '
  _itemSeparator = '; '
  _formDataValuePrefix = 'form-data'
  _valuePlaceholderForName = 'vvvvvvvvv'
  _formDataNameValuePair = 'name=' + this._doubleQuote + this._valuePlaceholderForName + this._doubleQuote
  _valuePlaceholderForFilename = 'fffffffff'
  _formFilenameValuePair = 'filename=' + this._doubleQuote + this._valuePlaceholderForFilename + this._doubleQuote
  _contentDispositionValue = this._formDataValuePrefix + this._itemSeparator + this._formDataNameValuePair
  _contentDispositionFileItem = this._contentDispositionValue + this._itemSeparator + this._formFilenameValuePair
  _contentDispositionText = 'Content-Disposition'
  _contentTypeText = 'Content-Type'
  _charsetPlaceholder = 'ccccccccc'
  _charsetValue = 'charset=' + this._charsetPlaceholder
  _textMimeTypeValue = 'text/plain'
  _requestData = ''
  _tail = ''
  _charset = ''
  _formFieldContent = ''
  _fileHeader = ''
  _requestLength = 0
  _buildDone = false

  _format(formatString, placeholder, actualValue) {
    return formatString.replace(placeholder, actualValue)
  }

  _append(value) {
    this._requestData += value
    return this
  }

  _appendFormData(value) {
    this._formFieldContent += value
    return this
  }

  _appendFileHeader(value) {
    this._fileHeader += value
    return this
  }

  get requestData() {
    return this._requestData
  }

  get requestLength() {
    return this._requestLength
  }

  get multipartBoundary() {
    return this._multipartBoundary
  }

  getFixedDigitLargestNumber(digitCount) {
    return Math.pow(10, digitCount - 1)
  }

  getFixedLengthRandomNumberString(minimum, digitCount) {
    return ('' + Math.floor(minimum + Math.random() * (digitCount - 1) * minimum)).substring(0, digitCount)
  }

  generateRandomNumberString(digitCount) {
    let limit = 15 // JavaScript digit count of highest allowed integer/number
    let finalNumber = '',
      count = digitCount,
      runningLimit = digitCount
    while (count > 0) {
      runningLimit = count > limit ? limit : count
      finalNumber += this.getFixedLengthRandomNumberString(this.getFixedDigitLargestNumber(runningLimit), runningLimit)
      count -= runningLimit
    }
    return finalNumber.substring(0, digitCount)
  }

  start(boundaryMarker, charset) {
    if (this._buildDone) return
    if (!boundaryMarker || boundaryMarker.length < 24) boundaryMarker = this.generateRandomNumberString(24)
    else if (boundaryMarker.length > 24) boundaryMarker = boundaryMarker.substr(0, 24)
    if (!charset) charset = 'utf8'

    this._multipartBoundary = this._boundaryPrefix + boundaryMarker
    this._charset = charset
    this._tail = this._boundarySeparator + this._multipartBoundary + this._boundarySeparator + this._separator
    this._requestLength = 0
  }

  addDataMultiPart(key, value) {
    if (this._buildDone) return
    this._formFieldContent = ''
    this._appendFormData(this._boundarySeparator + this._multipartBoundary)._appendFormData(this._separator)
    this._appendFormData(
      this._contentDispositionText + this._keyValueSeparator + this._format(this._contentDispositionValue, this._valuePlaceholderForName, key)
    )._appendFormData(this._separator)
    this._appendFormData(
      this._contentTypeText +
        this._keyValueSeparator +
        this._textMimeTypeValue +
        this._itemSeparator +
        this._format(this._charsetValue, this._charsetPlaceholder, this._charset)
    )._appendFormData(this._separator)
    this._appendFormData(this._separator)
    this._appendFormData(value)._appendFormData(this._separator)
    this._append(this._formFieldContent)
    this._requestLength += this._formFieldContent.length
  }

  _base64Encode(imageFilePath) {
    const bitmap = fs.readFileSync(imageFilePath)
    return Buffer.from(bitmap).toString('base64')
  }

  addFileMultiPart(key, filePath, filename) {
    if (this._buildDone) return
    this._fileHeader = ''
    if (!filename) filename = path.basename(filePath)
    if (path.extname(filePath) !== path.extname(filename)) throw new Error('Invalid name for file')
    const mimeType = mime.lookup(filename) || 'application/octet-stream'
    let contentDisposition = this._format(this._contentDispositionFileItem, this._valuePlaceholderForName, key)
    contentDisposition = this._format(contentDisposition, this._valuePlaceholderForFilename, filename)
    this._appendFileHeader(this._boundarySeparator + this._multipartBoundary)._appendFileHeader(this._separator)
    this._appendFileHeader(this._contentDispositionText + this._keyValueSeparator + contentDisposition)._appendFileHeader(this._separator)
    this._appendFileHeader(this._contentTypeText + this._keyValueSeparator + mimeType)._appendFileHeader(this._separator)
    this._appendFileHeader(this._separator)
    this._append(this._fileHeader)
    const fileData = this._base64Encode(filePath)
    this._append(fileData)
    this._append(this._separator)
    this._requestLength += this._fileHeader.length + fileData.length + this._separator.length
  }

  build() {
    if (this._buildDone) return
    this._buildDone = true
    this._append(this._tail)
    this._requestLength += this._tail.length
  }
}

module.exports = MultiPartBuilder
