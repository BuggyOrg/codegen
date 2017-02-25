module.exports = {
  print: (node) => `
  ${variable('IO_in')}->print_string(*${variable('text')});
  ${variable('IO_out')} = ${variable('IO_in')};
`,

  numToStr: (node) => `
  ${variable('outStr')} = std::shared_ptr<String>(new String(${t('Types.toStringName')('Number')}(*${variable('inNumber')})));
`,
}
