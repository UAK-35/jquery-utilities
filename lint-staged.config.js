module.exports = {
  '*.js': (files) => {
    return [
      // `eslint ${files.join(' ')} --fix`,
      // `prettier ${files.join(' ')} --write`,
      // 'git add'
      `eslint . --ext .js --format table`,
      `prettier ${files.join(' ')} --write`,
    ].filter(Boolean);
  }
}
// cdiff = "!f() { git diff $1^ $1l }; f"
// git cdiff HEAD
