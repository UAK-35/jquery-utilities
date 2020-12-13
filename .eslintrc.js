module.exports = {
  "root": true,
  "env": {
    "browser": true,
    "node": true,
    "es2020": true,
    "mocha": true,
  },
  "parserOptions": {
    "ecmaVersion": 2017,
    "sourceType": "module"
  },
  "parser": "babel-eslint",
  "extends": [
    "eslint:recommended"
  ],
  "rules": {
    "no-console": 0,
    "no-unused-vars": ["warn", { "vars": "all", "args": "all" } ],
    "no-undef": ["warn"],
    "no-proto": ["error"],
    "prefer-arrow-callback": ["warn"],
    "prefer-spread": ["warn"]
  }
}
