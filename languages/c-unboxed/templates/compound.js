module.exports = {
  Compound: {
    callProcess: (node) => {
      if (node.componentId === 'std/const' && node.metaInformation.parameters.type === 'Number') { 
        const outEdge = Graph.outIncidents(node, graph)[0]
        return `  ${t('Edge.name')(outEdge)} = ${node.metaInformation.parameters.value};`
      }
      return t('base')(node)
    }
  }
}
