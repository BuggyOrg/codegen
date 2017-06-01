module.exports = {
  'std/const': (node) => {
    if (Types.typeName(node.metaInformation.parameters.type) === 'Number') {
      return `${variable('const')} = ${node.metaInformation.parameters.value};`
    }
    return t('base')(node)
  }
}
