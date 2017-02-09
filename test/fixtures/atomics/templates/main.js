module.exports = {
  main: (graph) => {
    return Node.get('code', Graph.node('/atomic', graph))
  },

  Atomic: (contents) => {
    return contents
  }
}
