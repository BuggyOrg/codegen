module.exports = {
  Types: {
    typeName: (type) => {
      if (typeof (type) === 'object' && type.name === 'Function') {
        return t('Types.functionTypeName')(type)
      }
      return Types.typeName(type)
    },

    functionTypeName: (type) => {
      const ret = type.data[1].data[0]
      return 'std::function<void(std::shared_ptr<' + t('Types.typeName')(ret) + '>&)>'
    }
  }
}
