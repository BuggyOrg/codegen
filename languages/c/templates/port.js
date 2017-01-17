module.exports = {

  portType: `<%= data.type === 'String' ? 'char' : 'IO' %>`,
  portName: `<%= data.port %>`,
  portVariable: `p_<%= data.port %>_<%= sanitize(data.node) %>`

}
