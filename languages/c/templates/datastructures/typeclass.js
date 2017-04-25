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
  ${orTypes.map((t, idx) => '\n  ' + typeName + '(' + t.name + '* ptr) {\n' +
'    this->data = (void*)(new std::shared_ptr<' + t.name + '>(ptr));\n' +
'    this->subType = "' + t.name + '";\n' +
'  }').join('\n')}

  ~${typeName}() {
    if (false) {}
    ${orTypes.map((t, idx) => 'else if (this->subType == "' + t.name + '") { delete ((std::shared_ptr<' + t.name + '>*)(this->data))->get()); }').join('\n')}
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
  ${orTypes.map((t, idx) => 'else if (obj.subType == "' + t.name + '") { return __' + t.name + '_to_std__string(*((std::shared_ptr<' + t.name + '>*)(obj.data))->get()); }').join('\n')}
}
`
      } else {
        return 'NO OR ON ROOT – NOT YET IMPLEMENTED <c/templates/datastructures/typeclass.js->typeClassToString>'
      }
    }

  }
}
