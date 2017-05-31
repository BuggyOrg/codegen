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
${orTypes.map((t, idx) => 'struct ' + sanitize(t.name) + ';').join('\n')}
${orTypes.map((type, idx) => sanitize(type.name) + '* ' + t('Types.copyName')(type.name) + '(const ' + sanitize(type.name) + '&);').join('\n')}

struct ${sanitize(typeName)};
${sanitize(typeName)}* ${t('Types.copyName')(typeName)}(const ${sanitize(typeName)}&);

struct ${sanitize(typeName)} {
  std::string subType;
  void* data;
  ${orTypes.map((type, idx) => '\n  ' + sanitize(typeName) + '(' + sanitize(type.name) + '* ptr) {\n' +
'    this->data = (void*)(' + t('Types.copyName')(type.name) + '(*ptr));\n' +
'    this->subType = "' + type.name + '";\n' +
'  }').join('\n')}

  ~${typeName}() {
    if (false) {}
    ${orTypes.map((type, idx) => 'else if (this->subType == "' + type.name + '") { delete ((' + t('Types.typeName')(type.name) + '*)(this->data)); }').join('\n')}
  }
};

std::string ${t('Types.toStringName')(struct.metaInformation.type.type.type)} (const ${sanitize(struct.metaInformation.type.type.type)}& obj);
`
      } else {
        return 'NO OR ON ROOT – NOT YET IMPLEMENTED <c/templates/datastructures/typeclass.js->typeClassToString>'
      }
    },

    typeClassCopy: (struct) => {
      const type = struct.metaInformation.type
      const typeName = type.type.type
      const isOr = type.definition.name === 'or'
      if (isOr) {
        const orTypes = type.definition.data
        return `
${sanitize(typeName)}* ${t('Types.copyName')(typeName)} (const ${sanitize(typeName)}& obj) {
  if (false) {}
  ${orTypes.map((type, idx) => 'else if (obj.subType == "' + type.name + '") { return new ' + sanitize(typeName) + '(__copy_' + sanitize(type.name) + '(*((' + t('Types.typeName')(type.name) + '*)(obj.data)))); }').join('\n')}
}
`
      } else {
        return 'NO OR ON ROOT – NOT YET IMPLEMENTED <c/templates/datastructures/typeclass.js->typeClassCopy>'
      }
    },

    typeClassToString: (struct) => {
      const type = struct.metaInformation.type
      const isOr = type.definition.name === 'or'
      if (isOr) {
        const orTypes = type.definition.data
        return `
std::string ${t('Types.toStringName')(struct.metaInformation.type.type.type)} (const ${sanitize(struct.metaInformation.type.type.type)}& obj) {
  if (false) {}
  ${orTypes.map((type, idx) => 'else if (obj.subType == "' + type.name + '") { return __' + sanitize(type.name) + '_to_std__string(*((' + t('Types.typeName')(type.name) + '*)(obj.data))); }').join('\n')}
}
`
      } else {
        return 'NO OR ON ROOT – NOT YET IMPLEMENTED <c/templates/datastructures/typeclass.js->typeClassToString>'
      }
    }

  }
}
