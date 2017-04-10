module.exports = {
  'math/add': (node) => `
  ${variable('sum')} = std::shared_ptr<Number>(new Number(${variable('summand1')}->value + ${variable('summand2')}->value));
`,

  'math/less': (node) => `
  ${variable('isLess')} = std::shared_ptr<Bool>(new Bool(${variable('lesser')}->value < ${variable('bigger')}->value));
`
}
