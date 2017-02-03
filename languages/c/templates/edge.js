
module.exports = {
  defineEdge: `std::shared_ptr<<%= t('edgeType')(data) %>> <%= t('edgeName')(data) %>;`,

  edgeName:
  `edge_<%= sanitize(data.from.node) %>_<% sanitize(data.from.port) %>` +
  `__<%= sanitize(data.to.node) %>_<% sanitize(data.to.port) %>`,

  edgeType: `<%=  t('Port.type')(Graph.port(data.from, graph)) %>`
}
