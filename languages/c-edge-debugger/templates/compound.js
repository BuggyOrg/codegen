module.exports = {
  Compound: {
    defineEdges: (node) => {
      const edges = Graph.edges(node)
      return edges.map((e) => `  debug_shared_ptr<${t('Edge.type')(e)}> ${t('Edge.name')(e)};`).join('\n')
    }
  }
}
