module.exports = {
  Port: {
    type: `<%= Types.typeName(data.type) %>`,
    name: `<%= data.port %>`,
    variable: `p_<%= data.port %>_<%= sanitize(data.node) %>`
  }
}
