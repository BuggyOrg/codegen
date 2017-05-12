module.exports = {
  print: (node) => `
  ${variable('IO_in')}->print_string(*${variable('text')});
  ${variable('IO_out')} = ${variable('IO_in')};
`,

  scan: (node) => `
  ${variable('text')} = std::shared_ptr<String>(new String(""));
  ${variable('IO_in')}->scan_string(*${variable('text')});
  ${variable('IO_out')} = ${variable('IO_in')};
`,

  numToStr: (node) => `
  ${variable('outStr')} = ${t('defType')('String', t('Types.toStringName')('Number') + '(*' + variable('inNumber') + ')')};
`,

  strToNum: (node) => `
  ${variable('outNumber')} = std::shared_ptr<Number>(new Number(atoi(${t('value')('', 'inStr')}.c_str())));
`,

  ifThunk: (node) => `
  if (${t('value')('Bool', 'condition')}) {
    (*${variable('inTrue')})(${variable('choice')});
  } else {
    (*${variable('inFalse')})(${variable('choice')});
  }
`,

  ifThunkFalse: (node) => `
  if (${t('value')('Bool', 'condition')}) {
    ${variable('choice')} = ${variable('inTrue')};
  } else {
    (*${variable('inFalse')})(${variable('choice')});
  }
`,

  ifThunkTrue: (node) => `
  if (${t('value')('Bool', 'condition')}) {
    (*${variable('inTrue')})(${variable('choice')});
  } else {
    ${variable('choice')} = ${variable('inFalse')};
  }
`,

  'if': (node) => `
  if (${t('value')('Bool', 'condition')}) {
    ${variable('choice')} = ${variable('inTrue')};
  } else {
    ${variable('choice')} = ${variable('inFalse')};
  }
`,

  '!': (node) => `
  ${variable('negatedIn')} = std::shared_ptr<Bool>(new Bool(!${t('value')('', 'in')}));
`
}
