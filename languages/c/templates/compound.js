module.exports = {
  compound: `
void P__<%= sanitize(data.componentId) %> (<%= Node.inputPorts(data).map((a) => 'std::shared_ptr<' + portType(a) + '> input_' + portName(a)).join(', ') %>` +
  `<%= (Node.outputPorts(data).length > 0 && Node.inputPorts(data).length > 0) ? ', ' : '' %>` +
  `<%= Node.outputPorts(data).map((a) => 'std::shared_ptr<' + portType(a) + '> output_' + portName(a)).join(', ') %>) {
  // define edges
  <%= Graph.edges(graph).map(defineEdge).join('\\n') %>

  // store input ports

}`
}
