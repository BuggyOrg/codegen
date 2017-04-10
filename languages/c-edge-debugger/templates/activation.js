module.exports = {
  EdgeDebugger: {
    activation: (context) => {
      // only handle edges
      if (context.template === 'Compound.defineEdges') {
        // does not yet work with edge selection
        return true
        // return typeof (context.data.type) === 'string'
        // return !context.options || !context.options.selectEdge
      }
      return true
    }
  }
}
