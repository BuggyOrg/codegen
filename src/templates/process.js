export const process = `
function <%= sanitize(node.componentId) %> (<%= Node.inputPorts(node).map(portArgument).join(', ') %>) {
  <%= Node.get('code', node) %>
}
`
