module.exports = {
  main: `
<%= includes(data) %>

<%= structs(data).map(Datastructures.definition).join('\\n') %>

<%= atomics(data).map(Process.definition).join('\\n') %>
<%= compounds(data).map(Compound.definition).join('\\n') %>

<%= main(data) %>
`
}
