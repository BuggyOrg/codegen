module.exports = {
  compound: `
void P_<%= sanitize(data.componentId) %> (<%= Node.inputPorts(data, true).map((a) => 'std::shared_ptr<' + portType(a) + '>& input_' + portName(a)).join(', ') %>` +
  `<%= (Node.outputPorts(data, true).length > 0 && Node.inputPorts(data, true).length > 0) ? ', ' : '' %>` +
  `<%= Node.outputPorts(data, true).map((a) => 'std::shared_ptr<' + portType(a) + '>& output_' + portName(a)).join(', ') %>) {
  // define edges
  <%= Graph.edges(graph).map(defineEdge).join('\\n') %>

  // store input ports
  <%= Node.inputPorts(data).map(compoundInputs).join('\\n') %>

  <%= Graph.Algorithm.topologicalSort(graph).map(callProcess).join('\\n') %>
}`,

  compoundInputs: `<%= Graph.outIncidents(data, graph).map(edgeName).map((i) => i + ' = input_' + data.port) %>;`,

  callProcess: `{
    <%= Node.outputPorts(data).map((p) => 'std::shared_ptr<' + portType(Graph.port(p, graph)) + '> ' + portVariable(p)).join('\\n') %>;
    P_<%= sanitize(data.componentId) %>(<%= Node.inputPorts(data).map((p) => edgeName(Graph.inIncident(p, graph))).join(", ") %>` +
     `<%= (Node.outputPorts(data).length > 0 && Node.inputPorts(data).length > 0) ? ', ' : '' %>` +
     `<%= Node.outputPorts(data).map((p) => portVariable(p)).join(", ") %>);
    <%= Graph.outIncidents(data, graph).map((edge) => edgeName(edge) + ' = ' + portVariable(edge.from)).join('\\n') %>;
  }`
}
