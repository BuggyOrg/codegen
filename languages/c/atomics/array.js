module.exports = {
  'array/first': (node) => {
    const outputType = t('Types.typeName')(Node.outputPorts(node)[0].type)
    return `
  ${variable('val')} = std::shared_ptr<${outputType}>(new ${outputType}(${variable('inArray')}->v[0]));
`
  },

  'array/rest': (node) => {
    const outputType = t('Types.typeName')(Node.outputPorts(node)[0].type)
    const innerType = t('Types.typeName')(Node.outputPorts(node)[0].type.data[0])
    return `
  ${variable('outArray')} = std::shared_ptr<${outputType}>(new ${outputType}(std::vector<${innerType}>(${variable('inArray')}->v.begin() + 1, ${variable('inArray')}->v.end())));
`
  },

  'array/push': (node) => ``,

  'array/length': (node) => `
  ${variable('length')} = std::shared_ptr<Number>(new Number(${variable('inArray')}->v.size()));
`,

  'Array': (node) => {
    const len = node.metaInformation.length
    const arrType = node.ports[0].type
    const arrTN = t('Types.typeName')(arrType)
    const inputs = Array.apply(null, Array(len)).map((_, idx) => '*' + variable('input') + idx)
    return `
  ${variable('output')} = std::shared_ptr<Array<${arrTN}>>(new Array<${arrTN}>({${inputs.join(', ')}}));
`
  }
}
