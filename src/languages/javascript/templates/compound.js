module.exports = {
  compound: `
function <%= sanitize(node.componentId) %> (<%= Node.inputPorts(node).map(portArgument).join(', ') %>` +
  `<%= (Node.outputPorts(node).length > 0 && Node.inputPorts(node).length > 0) ? ', ' : '' %>` +
  `<%= Node.outputPorts(node).map(portArgument).map((a) => 'output_' + a).join(', ') %>) {
  // define edges
  <%= Graph.edges(graph).map(defineEdge).join('\\n') %>

  // store input ports
  <%= Node.inputPorts(node).map(compoundInputs).join('\\n') %>

  <%= Graph.Algorithm.topologicalSort(graph).map(callProcess).join('\\n') %>
}`,

  compoundInputs: `<%= Graph.outIncidents(data, graph).map(edgeName).map((i) => i + ' = ' + data.port) %>`,

  portVariable: `p_<%= data.port %>_<%= sanitize(data.node) %>`,

  callProcess: `{
    <%= Node.outputPorts(data).map((p) => 'var ' + portVariable(p) + ' = {}').join('\\n') %>
    <%= sanitize(data.componentId) %>(<%= Node.inputPorts(data).map((p) => edgeName(Graph.inIncident(p, graph))).join(", ") %>` +
     `<%= (Node.outputPorts(data).length > 0 && Node.inputPorts(data).length > 0) ? ', ' : '' %>` +
     `<%= Node.outputPorts(data).map((p) => portVariable(p)).join(", ") %>)
    <%= Graph.outIncidents(data, graph).map((edge) => edgeName(edge) + ' = ' + portVariable(edge.from)).join('\\n') %>
  }`
}
