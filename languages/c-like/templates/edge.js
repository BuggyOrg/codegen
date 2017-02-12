module.exports = {
  Edge: {
    name: (edge) =>
      `edge_${sanitize(edge.from.node)}_${sanitize(edge.from.port)}` +
      `__${sanitize(edge.to.node)}_${sanitize(edge.to.port)}`,

    type: (edge) => {
      return Types.typeName(edge.type)
    }
  }
}
