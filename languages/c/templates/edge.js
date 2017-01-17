
module.exports = {
  defineEdge: `std::shared_ptr<<%= edgeType(data) %>> <%= edgeName(data) %>`,

  edgeName:
  `edge_<%= sanitize(data.from.node) %>_<% sanitize(data.from.port) %>` +
  `__<%= sanitize(data.to.node) %>_<% sanitize(data.to.port) %>`,

  edgeType: '<%= portType(data.from) %>'
}
