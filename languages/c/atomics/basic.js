module.exports = {
  print: (node) => `
  ${variable('IO_in')}->print_string(*${variable('text')});
  ${variable('IO_out')} = ${variable('IO_in')};
`
}
