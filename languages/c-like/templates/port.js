module.exports = {
  Port: {
    type: (port) =>
      Types.typeName(port.type),

    name: (node) => node.port,

    variable: (node) => `p_${node.port}_${sanitize(node.node)}`
  }
}
