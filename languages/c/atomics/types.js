module.exports = {
  isType: (node) => `
  // TODO: FIXME
  if (${variable('typeName')}->value == ${variable('value')}->subType) {
    ${variable('isType')} = std::shared_ptr<Bool>(new Bool(true));
  } else {
    ${variable('isType')} = std::shared_ptr<Bool>(new Bool(false));
  }
`
}
