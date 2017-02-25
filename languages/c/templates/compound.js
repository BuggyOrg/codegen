module.exports = {
  Compound: {
    prefix: (node) => {
      return `
${t('Compound.defineEdges')(node)}

${t('Compound.assignInputs')(node)}
`
    },

    defineEdges: (node) => {
      const edges = Graph.edges(node)
      return edges.map(t('Compound.defineEdge')).join('\n')
    },

    defineEdge: (edge) => `  std::shared_ptr<${t('Edge.type')(edge)}> ${t('Edge.name')(edge)};`,

    assignInputs: (node) => {
      const inputPorts = Node.inputPorts(node).map((port) =>
        ({port, edges: Graph.outIncidents(port, graph)}))
      return `${inputPorts.map((p) => p.edges.map((e) => '  ' + t('Compound.edgeAssign')(e)(`input_${p.port.port}`))).join('\n')}`
    },

    edgeAssign: (edge) => (variable) => `${t('Edge.name')(edge)} = ${variable};`,

    body: (node) => {
      const topo = Graph.Algorithm.topologicalSort(node)
      return `${t('Compound.prefix')(node)}
${topo.map(t('Compound.callProcess')).join('\n')}
${t('Compound.postfix')(node)}`
    },

    callProcess: (node) => {
      const outputVariables = Node.outputPorts(node).map((p) =>
        `std::shared_ptr<${t('Port.type')(Graph.port(p, graph))}> ${t('Port.variable')(p)};`)

      const inputArguments = Node.inputPorts(node).map((p) => t('Edge.name')(Graph.inIncident(p, graph)))
      const outputArguments = Node.outputPorts(node).map(t('Port.variable'))
      const functionArguments = inputArguments.concat(outputArguments).join(', ')

      const functionCall = `P_${componentName(node)}(${functionArguments});`

      const edgeAssignments = Graph.outIncidents(node, graph).map((edge) =>
        `    ${t('Edge.name')(edge)} = ${t('Port.variable')(edge.from)};`).join('\n')

      return `  {
    ${outputVariables}
    ${functionCall}
${edgeAssignments}
  }`
    },

    postfix: (node) => ``,
  },
}
