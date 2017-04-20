module.exports = {
  Datastructures: {
    typeclass: (struct) => {
      const type = struct.metaInformation.type
      const isOr = type.definition.name === 'or'
      var orTypes = []
      if (isOr) {
        orTypes = type.definition.data
      }
      return `
struct ${t('Types.typeName')(struct.metaInformation.type)} {
  std::string subType;
  std::shared_ptr<void> data;
};
${t('Datastructures.typeClassCopy')(struct)}

${orTypes.map(t('Datastructures.preStruct')).join('\n')}
${orTypes.map(t('Datastructures.preDefToString')).join('\n')}

${t('Datastructures.typeClassToString')(struct)}
`
    },

    typeClassCopy: (struct) => {
      return ''
    },

    typeClassToString: (struct) => {
      const type = struct.metaInformation.type
      const isOr = type.definition.name === 'or'
      if (isOr) {
        const orTypes = type.definition.data
        return `
    /*${JSON.stringify(struct.metaInformation.type, null, 2)}*/
std::string ${t('Types.toStringName')(struct.metaInformation.type.type.type)} (const ${struct.metaInformation.type.type.type}& obj) {
  if (false) {}
  ${orTypes.map((t, idx) => 'else if (obj.subType == ' + idx + ') { return __' + t.name + '_to_std__string(*(' + t.name + '*)&obj->value.data) } )').join('\n')}
}
`
      } else {
        return 'NO OR ON ROOT – NOT YET IMPLEMENTED <c/templates/datastructures/typeclass.js->typeClassToString>'
      }
    }

  }
}
