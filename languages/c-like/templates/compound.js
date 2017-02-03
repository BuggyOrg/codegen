module.exports = {
  Compound: {
    definition: `
<%= t('Function.definition')({
  prefix: 'P_',
  name: t('Component.name')(data),
  arguments: JSON.parse(t('Component.arguments')(data)),
  content: t('Compound.body')(data)
})%>`,

    body: `
  <%= t('Compound.edges')(data) %>
  <%= t('Compound.inputs')(data) %>
  <%= t('Compound.subroutines')(data) %>
`,

    edges: `
  // define edges
  <%= Graph.edges(data).map(t('defineEdge')).join('\\n') %>
    `,

    inputs: `
  // gather inputs
  <%= Node.inputPorts(data).map(t('Compound.cinputs')).join('\\n') %>
`,

    cinputs: `<%= Graph.outIncidents(data, graph).map(t('edgeName')).map((i) => i + ' = input_' + data.port) %>;`,

    subroutines: `
  // call sub routines (in topological order)
  <%= Graph.Algorithm.topologicalSort(data).map(t('Compound.callProcess')).join('\\n') %>
`,

    callProcess: `{
    <%= Node.outputPorts(data).map((p) => 'std::shared_ptr<' + t('Port.type')(Graph.port(p, graph)) + '> ' + t('Port.variable')(p)).join('\\n') %>;
    P_<%= componentName(data) %>(<%= Node.inputPorts(data).map((p) => t('edgeName')(Graph.inIncident(p, graph))).join(", ") %>` +
     `<%= (Node.outputPorts(data).length > 0 && Node.inputPorts(data).length > 0) ? ', ' : '' %>` +
     `<%= Node.outputPorts(data).map((p) => t('Port.variable')(p)).join(", ") %>);
    <%= Graph.outIncidents(data, graph).map((edge) => t('edgeName')(edge) + ' = ' + t('Port.variable')(edge.from)).join('\\n') %>;
  }`

  }
}
