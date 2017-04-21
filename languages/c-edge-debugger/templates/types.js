module.exports = {
  Types: {
    definition: (typeName) => {
      return `${t('base')(typeName)}

  ${t('defineSpecialization')(typeName)}

`
    }
  },

  Datastructures: {
    typeclass: (struct) => {
      return `${t('base')(struct)}

${t('defineSpecialization')(struct.metaInformation.type.type.type)}
`
    }
  }
}