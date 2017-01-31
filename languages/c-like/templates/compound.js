module.exports = {
  Compound: {
    definition: `
<%= Function.definition({
  prefix: 'P_',
  name: Component.name(data)
  arguments: Component.arguments(data),
  content: Compound.body(data)
%>
`,

    body: `
  <%= Compound.edges(data) %>
  <%= Compound.inputs(data) %>
  <%= Compound.subroutines(data) %>
`,

    edges: `
  // define edges
  <%= Graph.edges(data).map(defineEdge).join('\\n') %>
    `,

    inputs: `
  // gather inputs
  <%= Node.inputPorts(data).map(compoundInputs).join('\\n') %>
`,

    subroutines: `
  // call sub routines (in topological order)
  <%= Graph.Algorithm.topologicalSort(data).map(callProcess).join('\\n') %>
`

  }
}
