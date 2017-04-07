module.exports = {
  Types: {
    typeName: (type) => {
      if (typeof (type) === 'object' && type.name === 'Function') {
        return t('Types.functionTypeName')(type)
      }
      return Types.typeName(type)
    },

    functionTypeName: (type) => {
      const args = [...type.data[0].data, ...type.data[1].data]
      const argPtrs = args.map((a) => 'std::shared_ptr<' + t('Types.typeName')(a) + '>&')
      return 'std::function<void(' + argPtrs.join(', ') + ')>'
    }
  }
}
