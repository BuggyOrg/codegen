module.exports = {
  Compound: {
    defineEdges: (node) => {
      const edges = Graph.edges(node)
      return edges.map((e) => {
        if (typeof (e.type) === 'string') {
          return `  debug_shared_ptr<${t('Edge.type')(e)}> ${t('Edge.name')(e)};`
        } else return `  std::shared_ptr<${t('Edge.type')(e)}> ${t('Edge.name')(e)};`
      }).join('\n')
    }
  }
}
