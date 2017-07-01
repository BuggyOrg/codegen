module.exports = {
  Port: {
    type: (port) =>
      port.type,

    name: (node) => node.port,

    variable: (node) => `p_${sanitize(node.port)}_${sanitize(node.node)}`
  }
}
