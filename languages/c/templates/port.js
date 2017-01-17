module.exports = {

  portType: `<%= data.type === 'String' ? 'char' : 'IO' %>`,
  portName: `<%= data.port %>`

}
