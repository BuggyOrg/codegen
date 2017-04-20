module.exports = {
  isType: (node) => `
  // TODO: FIXME
  if (${variable('typeName')}->value == "Nil") {
    ${variable('isType')} = new std::shared_ptr<Bool>(new Bool(true));
  } else {
    ${variable('isType')} = new std::shared_ptr<Bool>(new Bool(true));
  }
`
}
