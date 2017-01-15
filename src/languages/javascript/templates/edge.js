
module.exports = {
  defineEdge: `var <%= edgeName(data) %> = {}`,

  edgeName:
  `edge_<%= sanitize(data.from.node) %>_<% sanitize(data.from.port) %>`+
  `__<%= sanitize(data.to.node) %>_<% sanitize(data.to.port) %>`
}
