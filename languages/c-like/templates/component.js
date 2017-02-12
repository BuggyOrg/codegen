module.exports = {
  Component: {
    name: (node) => {
      return sanitize(node.componentId +
        ((node.metaInformation && node.metaInformation.parameters) ? hash(node.metaInformation.parameters) : ''))
    }
  }
}
