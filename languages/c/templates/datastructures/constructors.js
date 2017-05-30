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
        fieldType: p.type,
        index: idx,
        type: node.type,
        output: '____TMP____'
      }))
      return `
  ${sanitize(node.type.name)}* ____TMP____ = new ${sanitize(node.type.name)}(${node.inputs.map((p) => '*' + variable(p.port)).join(', ')});
  ${variable(node.output.port)} = ${t('defType')(node.output.type, '____TMP____')};
`
    },

    destructor: (node) => t('Datastructures.destructorAssign')({
      input: Node.inputPorts(node)[0],
      output: Node.outputPorts(node)[0],
      type: node.metaInformation.datastructure,
      parameter: node.metaInformation.parameter
    }),

    destructorAssign: (assign) => {
      const value = `${t('Types.copyName')(assign.output.type)}(*((${t('Types.typeName')(assign.type.name)}*)${variable(assign.input.port)}->data)->arg${assign.parameter})`
      return `${variable(assign.output.port)} = ${t('dataType')(assign.output.type)}(${value});`
    },

    fieldAssign: (assign) => `  ${assign.output}->argp_${assign.index} = __copy_${t('Types.typeName')(assign.fieldType)}(${assign.name});`
  }
}
