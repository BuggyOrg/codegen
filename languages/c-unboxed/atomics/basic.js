module.exports = {
  numToStr: (node) => `
  ${variable('outStr')} = ${t('defType')('String', t('Types.toStringName')('Number') + '(' + variable('inNumber') + ')')};
`,

  strToNum: (node) => `
  ${variable('outNumber')} = atoi(${t('value')('', 'inStr')}.c_str());
`
}
