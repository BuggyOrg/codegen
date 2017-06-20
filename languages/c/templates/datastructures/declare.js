module.exports = {
  Datastructures: {
    preDefine: (struct) => {
      if (Types.isArray(struct)) {
        return ``
      } else if (Types.isConstructor(struct)) {
        return t('Datastructures.preStruct')(Types.structureData(struct))
      } else if (Types.isTypeClass(struct)) {
        return t('Datastructures.typeclassPreDeclaration')(struct)
      }
    },

    preStruct: (struct) => `struct ${sanitize(struct.name)};`,

    declaration: (struct) => {
      if (Types.isArray(struct)) {
        return ``
      } else if (Types.isConstructor(struct)) {
        return t('Datastructures.declareStruct')(Types.structureData(struct))
      } else if (Types.isTypeClass(struct)) {
        return t('Datastructures.typeclassDeclaration')(struct)
      }
    },

    declareStruct: (struct) => `
struct ${sanitize(struct.name)} {
${struct.structure.contents.map(t('Datastructures.structField')).join('\n')}

${sanitize(struct.name)}(${struct.structure.contents.map(t('Datastructures.structArgument')).join(', ')});
~${sanitize(struct.name)}();
};
`
  }
}
