module.exports = {
  Component: {
    name: (node) => {
      if (!node.componentId) {
        return node.id.slice(1)
      }
      return sanitize(node.componentId +
        ((node.metaInformation && node.metaInformation.parameters) ? hash(node.metaInformation.parameters) : ''))
    }
  }
}
