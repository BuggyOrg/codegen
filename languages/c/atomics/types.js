module.exports = {
  isType: (node) => `
  // TODO: FIXME
  if (${variable('typeName')}->value == ${variable('value')}->subType) {
    ${variable('isType')} = ${t('defType')('Bool', 'true')};
  } else {
    ${variable('isType')} = ${t('defType')('Bool', 'false')};
  }
`
}
