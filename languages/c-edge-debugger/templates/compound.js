module.exports = {
  Compound: {
    defineEdges: (node) => {
      const edges = Graph.edges(node)
      return edges.map((e) => `  std::shared_ptr<${t('Edge.type')(e)}> ${t('Edge.name')(e)}; // todo!!`).join('\n')
    }
  }
}
