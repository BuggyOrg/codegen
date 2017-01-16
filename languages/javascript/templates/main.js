module.exports = {
  main: `
<%= atomics(graph).map(process).join('\\n') %>
<%= compounds(graph).map(compound).join('\\n') %>

main({data: {print: console.log.bind(console)}, type: "IO"})
`
}
