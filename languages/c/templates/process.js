module.exports = {

  process: `
void P__<%= sanitize(data.componentId) %> (<%= Node.inputPorts(data).map((a) => 'std::shared_ptr<' + portType(a) + '> input_' + portName(a)).join(', ') %>` +
  `<%= (Node.outputPorts(data).length > 0 && Node.inputPorts(data).length > 0) ? ', ' : '' %>` +
  `<%= Node.outputPorts(data).map((a) => 'std::shared_ptr<' + portType(a) + '> output_' + portName(a)).join(', ') %>) {
  <%= Node.inputPorts(data).map((a) => portType(a) + '* v_' + portName(a) + ' = &(*input_' + portName(a) + ');').join('\\n') %>
  <%= Node.outputPorts(data).map((a) => portType(a) + '* v_' + portName(a) + ';').join('\\n') %>
  <%= Node.get('code', data) %>
  <%= Node.outputPorts(data).map((a) => 'output_' + portName(a) + ' = std::shared_ptr<' + portType(a) + '>(v_' + portName(a) + ');').join('\\n') %>
}
`

}
