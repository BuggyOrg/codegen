module.exports = {
  'array/first': (node) => {
    const outputType = t('Types.typeName')(Node.outputPorts(node)[0].type)
    return `
  ${variable('output')} = std::shared<${outputType}>(new ${t('Types.typeName')(outputType)}((${variable('inArray')}->get())[0]));
`
  },

  'array/rest': (node) => {
    const outputType = t('Types.typeName')(Node.outputPorts(node)[0].type)
    return `
  ${variable('output')} = std::shared<${outputType}>(new ${t('Types.typeName')(outputType)}((${variable('inArray')})->get() + 1));
`
  },

  'array/push': (node) => ``
}
