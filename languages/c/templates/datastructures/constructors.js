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
        output: '____TMP____'
      }))
      return `
    /* ${JSON.stringify(node, null, 2)} */
  ${node.type.name}* ____TMP____ = new ${node.type.name}();
  ${variable(node.output.port)} = std::shared_ptr<${node.output.type}>(new ${node.output.type}(____TMP____));
${fields.join('\n')}`
    },

    destructor: (node) => t('Datastructures.destructorAssign')({
      input: Node.inputPorts(node)[0],
      output: Node.outputPorts(node)[0],
      type: node.metaInformation.datastructure,
      parameter: node.metaInformation.parameter
    }),

    destructorAssign: (assign) => `${variable(assign.output.port)} = ((std::shared_ptr<${assign.type.name}>*)${variable(assign.input.port)}->data)->get()->arg${assign.parameter};`,

    fieldAssign: (assign) => `  ${assign.output}->argp_${assign.index} = ${assign.name};`
  }
}
