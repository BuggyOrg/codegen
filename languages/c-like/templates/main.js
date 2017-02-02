module.exports = {
  main: `
<%= t('includes')(graph) %>

<%= structs(graph).map(t('Datastructures.definition')).join('\\n') %>

<%= atomics(graph).map(t('Process.definition')).join('\\n') %>

<%= t('entry')(data) %>
`,

  includes: `// nothing...`,

  other: `
<%= structs(graph).map(t('Datastructures.definition')).join('\\n') %>

<%= atomics(graph).map(t('Process.definition')).join('\\n') %>
<%= compounds(graph).map(t('Compound.definition')).join('\\n') %>

<%= t('entry')(data) %>
`
}
