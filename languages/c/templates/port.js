module.exports = {

  portType: `<%= typeName(data.type) %>`,
  portName: `<%= data.port %>`,
  portVariable: `p_<%= data.port %>_<%= sanitize(data.node) %>`

}
