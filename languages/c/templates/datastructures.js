module.exports = {
  Datastructures: {
    definition: (struct) => {
      if (Types.isConstructor(struct)) {
        return t('Datastructures.struct')(Types.structureData(struct))
      } else if (Types.isTypeClass(struct)) {
        return t('Datastructures.typeclass')(struct)
      }
    },

    struct: (struct) => `
struct ${struct.name} {
${struct.structure.contents.map(t('Datastructures.structField')).join('\n')}
};`,

    structField: (field) => `  std::shared_ptr<${field.type}> ${field.name};`,

    typeclass: (struct) => `
struct ${Types.typeName(struct.metaInformation.type)} {
  std::string subType;
  std::shared_ptr<void> data;
};`,

    typeImplementation: (node) => (node) => {
      if (Types.isConstructor(node)) {
        return t('Datastructures.constructorCall')(node)
      } else if (Types.isDestructor(node)) {
        return t('Datastructures.destructor')(node)
      }
    },

    constructorCall: (node) => t('Datastructures.constructorAssign')({
      inputs: Node.inputPorts(node),
      output: Node.outputPorts(node)[0],
      type: node.metaInformation.datastructure
    }),

    constructorAssign: (node) => {
      const fields = node.inputs.map((p, idx) => t('Datastructures.fieldAssign')({
        name: variable(p.port),
        index: idx,
        type: node.type,
        output: variable(node.output.port)
      }))
      return `
  ${variable(node.output.port)} = std::shared_ptr<${node.type.name}>(new ${node.type.name}());
${fields.join('\n')}`
    },

    destructor: (node) => t('Datastructures.destructorAssign')({
      input: Node.inputPorts(node)[0],
      output: Node.outputPorts(node)[0],
      type: node.metaInformation.datastructure,
      parameter: node.metaInformation.parameter
    }),

    destructorAssign: (assign) => `${variable(assign.output.port)} = ${variable(assign.input.port)}->arg${assign.parameter};`,

    fieldAssign: (assign) => `  ${assign.output}->arg${assign.index} = ${assign.name};`
  }
}
