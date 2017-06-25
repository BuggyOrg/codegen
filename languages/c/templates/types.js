module.exports = {
  Types: {
    typeName: (type) => {
      if (typeof (type) === 'object' && type.name === 'Function') {
        return t('Types.functionTypeName')(type)
      }
      const typeName = Types.typeName(type)
      if (typeof (typeName) === 'string') return sanitize(typeName)
      else if (type.name === 'Array') return type.name + '<' + type.data.map((type) => t('Types.typeName')(type) + '*').join(', ') + '>'
      else return type.name + '<' + type.data.map(t('Types.typeName')).join(', ') + '>'
    },

    functionTypeName: (type) => {
      const args = [...type.data[0].data, ...type.data[1].data]
      const argPtrs = args.map((a) => t('dataType')(a) + '&')
      return 'std::function<void(' + argPtrs.join(', ') + ')>'
    }
  },

  dataType: (type) =>
    `std::shared_ptr<${t('Types.typeName')(type)}>`,

  defType: (type, value) => {
    return `${t('dataType')(type)}(new ${t('Types.typeName')(type)}(${value}))`
  },

  value: (type, name) => {
    console.error(type, name)
    return variable(name) + '->value'
  }
}
