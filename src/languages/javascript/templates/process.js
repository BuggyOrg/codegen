module.exports = {

  process: `
function <%= sanitize(node.componentId) %> (<%= Node.inputPorts(node).map(portArgument).map((a) => 'input_' + a).join(', ') %>` +
  `<%= (Node.outputPorts(node).length > 0 && Node.inputPorts(node).length > 0) ? ', ' : '' %>` +
  `<%= Node.outputPorts(node).map(portArgument).map((a) => 'output_' + a).join(', ') %>) {
  <%= Node.inputPorts(node).map(portArgument).map((a) => 'const v_' + a + ' = input_' + a + '.data').join('\\n') %>
  <%= Node.outputPorts(node).map(portArgument).map((a) => 'var v_' + a).join('\\n') %>
  <%= Node.get('code', node) %>
  <%= Node.outputPorts(node).map(portArgument).map((a) => 'output_' + a + '.data = v_' + a).join('\\n') %>
}
`

}
