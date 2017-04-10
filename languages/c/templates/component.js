module.exports = {
  Component: {
    name: (node) => {
      if (node.componentId === 'functional/lambda') {
        return t('base')(node) + sanitize(Node.id(Graph.Lambda.implementation(node)))
      } else {
        return t('base')(node)
      }
    }
  }
}
