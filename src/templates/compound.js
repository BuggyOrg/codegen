export const compound = `
function <%= *sanitize*(?node.componentId?) %> (<%= *Node.inputPorts*(?node?).map(*portArgument*).join(', ') %>) {
  <%= Graph.inIncidents(?node?, graph).map(defineEdge).join('\n') %>
  <%= Graph.outIncidents(node, graph).map(defineEdge).join('\n') %>
}
`

// template: String[template] -> *Env* -> (obj? -> String[code])

export const imports = {
  defineEdge: `
  const edgeName(edge) = <%= typeName(edge.type) %>
`,

  edgeName: `
  <%= sanitize(edge.from.node) %>_<% sanitize(edge.from.port) %>__<%= sanitize(edge.to.node) %>_<% sanitize(edge.to.port) %>
`,

  typeName: `<%= obj %>`
}
