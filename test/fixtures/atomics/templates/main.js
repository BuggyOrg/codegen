module.exports = {
  main: (graph) => {
    return Node.get('code', Graph.node('/atomic', graph))(graph)
  },

  Atomic: (contents) => {
    return contents
  }
}
