module.exports = {
  Process: {
    definition: `
<%= Function.definition({
  prefix: 'P_',
  name: Component.name(data)
  arguments: Component.arguments(data),
  content: Process.body(data)
}) %>
`,

    body: `
  <%= Node.inputPorts(data).map((a) => 'std::shared_ptr<' + portType(a) + '> v_' + portName(a) + ' = input_' + portName(a) + ';').join('\\n') %>
  <%= Node.outputPorts(data).map((a) => 'std::shared_ptr<' + portType(a) + '> v_' + portName(a) + ';').join('\\n') %>
  <%= Node.get('code', data) %>
  <%= Node.outputPorts(data).map((a) => 'output_' + portName(a) + ' = v_' + portName(a) + ';').join('\\n') %>
`

  }
}
