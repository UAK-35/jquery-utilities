module.exports = {
  semi: false,
  overrides: [
    {
      files: ['*.js', '*.json'],
      options: {
        proseWrap: 'preserve',
        tabWidth: 2,
        singleQuote: true,
        printWidth: 170,
        endOfLine: 'lf',
        trailingComma: 'es5',
        arrowParens: 'always',
        jsxBracketSameLine: false,
        bracketSpacing: false,
        useTabs: false,
        quoteProps: "as-needed",
        jsxSingleQuote: false,
        requirePragma: false,
        insertPragma: true,
      },
    },
    {
      files: ['*.html'],
      options: {
        printWidth: 1000,
        tabWidth: 4,
        htmlWhitespaceSensitivity: 'ignore',
        proseWrap: 'never',
      },
    },
  ],
};
