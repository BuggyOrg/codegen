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

${t('Datastructures.typeClassCopy')(struct)}

${orTypes.map(t('Datastructures.preDefToString')).join('\n')}

${t('Datastructures.typeClassToString')(struct)}
`
    },

    typeclassDeclaration: (struct) => {
      const type = struct.metaInformation.type
      const isOr = type.definition.name === 'or'
      const typeName = t('Types.typeName')(struct.metaInformation.type)
      if (isOr) {
        const orTypes = type.definition.data
        return `
${orTypes.map((t, idx) => 'struct ' + t.name + ';').join('\n')}

struct ${typeName} {
  std::string subType;
  void* data;
  ${orTypes.map((type, idx) => '\n  ' + typeName + '(' + type.name + '* ptr) {\n' +
'    this->data = (void*)(new ' + t('dataType')(type.name) + '(ptr));\n' +
'    this->subType = "' + type.name + '";\n' +
'  }').join('\n')}

  ~${typeName}() {
    if (false) {}
    ${orTypes.map((type, idx) => 'else if (this->subType == "' + type.name + '") { delete ((' + t('dataType')(type.name) + '*)(this->data))->get(); }').join('\n')}
  }
};

std::string ${t('Types.toStringName')(struct.metaInformation.type.type.type)} (const ${struct.metaInformation.type.type.type}& obj);
`
      } else {
        return 'NO OR ON ROOT – NOT YET IMPLEMENTED <c/templates/datastructures/typeclass.js->typeClassToString>'
      }
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
std::string ${t('Types.toStringName')(struct.metaInformation.type.type.type)} (const ${struct.metaInformation.type.type.type}& obj) {
  if (false) {}
  ${orTypes.map((type, idx) => 'else if (obj.subType == "' + type.name + '") { return __' + type.name + '_to_std__string(*((' + t('dataType')(type.name) + '*)(obj.data))->get()); }').join('\n')}
}
`
      } else {
        return 'NO OR ON ROOT – NOT YET IMPLEMENTED <c/templates/datastructures/typeclass.js->typeClassToString>'
      }
    }

  }
}
