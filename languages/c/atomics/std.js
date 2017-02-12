module.exports = {
  'std/const': (node) => {
    switch (Types.typeName(node.metaInformation.parameters.type).toLowerCase()) {
      case 'number':
        return `${variable('const')} = std::shared_ptr<Number>(new int(${node.metaInformation.parameters.value}));`
      case 'string':
        return `${variable('const')} = std::shared_ptr<String>(new String("${node.metaInformation.parameters.value}"));`
    }
    return `${assignment}`
  }
}
