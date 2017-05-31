module.exports = {
  Datastructures: {
    definition: (struct) => {
      if (Types.isArray(struct)) {
        return ``
      } else if (Types.isConstructor(struct)) {
        return t('Datastructures.struct')(Types.structureData(struct))
      } else if (Types.isTypeClass(struct)) {
        return t('Datastructures.typeclass')(struct)
      }
    },

    declaration: (struct) => {
      if (Types.isArray(struct)) {
        return ``
      } else if (Types.isConstructor(struct)) {
        return t('Datastructures.preStruct')(Types.structureData(struct))
      } else if (Types.isTypeClass(struct)) {
        return t('Datastructures.typeclassDeclaration')(struct)
      }
    },

    preStruct: (struct) => `struct ${sanitize(struct.name)};`,

    struct: (struct) => `
struct ${sanitize(struct.name)} {
${struct.structure.contents.map(t('Datastructures.structField')).join('\n')}

${sanitize(struct.name)}(${struct.structure.contents.map(t('Datastructures.structArgument')).join(', ')}) {
    ${struct.structure.contents.map((field) => '  this->' + field.name + ' = __copy_' + t('Types.typeName')(field.type) + '(' + field.name + ');').join('\n')};
  }
};

${t('Datastructures.copy')(struct)}

${t('Datastructures.toString')(struct)}
`,

    structField: (field) => `${field.type}* ${field.name};`,

    structArgument: (field) => `${field.type}& ${field.name}`,

    copy: (struct) => `
${sanitize(struct.name)}* ${t('Types.copyName')(struct.name)} (const ${sanitize(struct.name)}& obj) {
  return ${t('Datastructures.copyImpl')(struct)}
}
`,

    toString: (struct) => `
std::string ${t('Types.toStringName')(struct.name)} (const ${sanitize(struct.name)}& obj) {
  return ${t('Datastructures.toStringImpl')(struct)}
}
`,

    preDefToString: (struct) => `
std::string ${t('Types.toStringName')(struct.name)} (const ${sanitize(struct.name)}& obj);
`,

    toStringImpl: (struct) => {
      if (typeof (struct) === 'object' && struct.structure && struct.structure.contents.length === 0) {
        return '"()";'
      }
      if (typeof (struct) === 'object' && struct.structure) {
        return '"(" + ' + struct.structure.contents.map((type) =>
          `${t('Datastructures.toStringImpl')(type)}(*obj.${type.name})`)
          .join(' + ", " + ') + ' + ")";'
      } else if (typeof (struct) === 'object' && struct.kind === 'basic') {
        return t('Types.toStringName')(struct.type)
      } else if (typeof (struct) === 'string') {
        return t('Types.toStringName')(struct)
      } else {
        throw new Error('Not implemented toString conversion for type: "' + JSON.stringify(struct) + '"')
      }
    },

    copyImpl: (struct) => {
      if (typeof (struct) === 'object' && struct.structure && struct.structure.contents.length === 0) {
        return `new ${sanitize(struct.name)}();`
      }
      if (typeof (struct) === 'object' && struct.structure) {
        return 'new ' + sanitize(struct.name) + '(' + struct.structure.contents.map((type) =>
          `*obj.${type.name}`)
          .join(', ') + ');'
      } else if (typeof (struct) === 'object' && struct.kind === 'basic') {
        return t('Types.copyName')(struct.type)
      } else if (typeof (struct) === 'string') {
        return t('Types.copyName')(struct)
      } else {
        throw new Error('Not implemented "copy" for type: "' + JSON.stringify(struct) + '"')
      }
    },

    typeImplementation: (node) => (node) => {
      if (Types.isConstructor(node)) {
        return t('Datastructures.constructorCall')(node)
      } else if (Types.isDestructor(node)) {
        return t('Datastructures.destructor')(node)
      }
    }
  }
}
