module.exports = {
  Port: {
    type: (port) =>
      t('Types.typeName')(port.type),

    name: (node) => node.port,

    variable: (node) => `p_${node.port}_${sanitize(node.node)}`
  }
}
