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
      return edges.map((e) => `  std::shared_ptr<${t('Edge.type')(e)}> ${t('Edge.name')(e)};`).join('\n')
    },

    assignInputs: (node) => {
      const inputPorts = Node.inputPorts(node).map((port) =>
        ({port, edges: Graph.outIncidents(port, graph)}))
      return `${inputPorts.map((p) => p.edges.map((e) => '  ' + t('Edge.name')(e) + ' = input_' + p.port.port + ';')).join('\n')}`
    },

    postfix: (node) => ``,

    body: (node) => {
      const topo = Graph.Algorithm.topologicalSort(node)
      return `${t('Compound.prefix')(node)}
${topo.map(t('Compound.callProcess')).join('\n')}
${t('Compound.postfix')(node)}`
    },

    callProcess: (node) => `  {
${Node.outputPorts(node).map((p) => '    std::shared_ptr<' + t('Port.type')(Graph.port(p, graph)) + '> ' + t('Port.variable')(p)).join('\n')};
    P_${componentName(node)}(${Node.inputPorts(node).map((p) => t('Edge.name')(Graph.inIncident(p, graph))).join(', ')}` +
     `${(Node.outputPorts(node).length > 0 && Node.inputPorts(node).length > 0) ? ', ' : '' }` +
     `${Node.outputPorts(node).map((p) => t('Port.variable')(p)).join(', ')});
    ${Graph.outIncidents(node, graph).map((edge) => t('Edge.name')(edge) + ' = ' + t('Port.variable')(edge.from)).join('\n')};
  }`
  }
}
