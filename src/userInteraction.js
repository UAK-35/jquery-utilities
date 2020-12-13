/** @format */

class UserInteraction {
  logit(message) {
    console.log(message)
  }

  logjson(message, jsonObject) {
    console.log(message, JSON.stringify(jsonObject, null, 2))
  }

  successAlert(message) {
    console.log(message)
  }

  errlogit(message) {
    console.error(message)
  }

  errorAlert(message) {
    console.error(message)
  }

  errlogitjson(message, jsonObject) {
    console.error(message, JSON.stringify(jsonObject, null, 2))
  }
}

module.exports = UserInteraction
