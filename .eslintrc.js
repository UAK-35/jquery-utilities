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
  "plugins": ["sonarjs"],
  "extends": [
    "eslint:recommended",
    "plugin:sonarjs/recommended"
  ],
  "rules": {
    "sonarjs/cognitive-complexity": ["error", 5],
    "no-console": 0,
    "no-unused-vars": ["warn", { "vars": "all", "args": "all" } ],
    "no-undef": ["warn"],
    "no-proto": ["error"],
    "prefer-arrow-callback": ["warn"],
    "prefer-spread": ["warn"]
  }
}
