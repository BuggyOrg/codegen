module.exports = {

  process: `
function <%= sanitize(data.componentId) %> (<%= Node.inputPorts(data).map(portArgument).map((a) => 'input_' + a).join(', ') %>` +
  `<%= (Node.outputPorts(data).length > 0 && Node.inputPorts(data).length > 0) ? ', ' : '' %>` +
  `<%= Node.outputPorts(data).map(portArgument).map((a) => 'output_' + a).join(', ') %>) {
  <%= Node.inputPorts(data).map(portArgument).map((a) => 'const v_' + a + ' = input_' + a + '.data').join('\\n') %>
  <%= Node.outputPorts(data).map(portArgument).map((a) => 'var v_' + a).join('\\n') %>
  <%= Node.get('code', data) %>
  <%= Node.outputPorts(data).map(portArgument).map((a) => 'output_' + a + '.data = v_' + a).join('\\n') %>
}
`

}
