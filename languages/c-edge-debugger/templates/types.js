module.exports = {
  Types: {
    definition: (typeName) => {
      return `${t('base')(typeName)}

  ${t('defineSpecialization')(typeName)}

`
    }
  }
}