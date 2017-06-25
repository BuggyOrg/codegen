module.exports = {
  dataType: (type) => {
    if (type === 'Number') {
      return t('Types.typeName')(type)
    }
    return `std::shared_ptr<${t('Types.typeName')(type)}>`
  },

  value: (type, name) => {
    if (type === 'Number') {
      return variable(name)
    }
    console.error(type, name)
    return t('base')(type, name)
  }
}
