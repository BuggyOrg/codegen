module.exports = {
  Datastructures: {
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
