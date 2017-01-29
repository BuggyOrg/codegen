module.exports = {
  main: `
<%= atomics(data).map(process).join('\\n') %>
<%= compounds(data).map(compound).join('\\n') %>

main({data: {print: console.log.bind(console)}, type: "IO"})
`
}
