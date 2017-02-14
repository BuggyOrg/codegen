module.exports = {
  EdgeDebugger: {
    activation: (context) => {
      // only handle edges
      if (Graph.Edge.isValid(context.data)) {
        // does not yet work with edge selection
        return !context.options.selectEdge
      }
    }
  }
}
