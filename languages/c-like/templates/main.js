module.exports = {
  main: `
<%= t('includes')(graph) %>

<%= t('Types.definition')(graph) %>

<%= structs(graph).map(t('Datastructures.definition')).join('\\n') %>

typedef SPair StringPair;

<%= atomics(graph).map(t('Process.definition')).join('\\n') %>

<%= compounds(graph).map(t('Compound.definition')).join('\\n') %>

<%= t('entry')(data) %>
`,

  includes: `
#include <memory>
#include <string.h>
`
}
