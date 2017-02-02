module.exports = {
  Process: {
    definition: `
<%= t('Function.definition')({
  prefix: 'P_',
  name: t('Component.name')(data),
  arguments: JSON.parse(t('Component.arguments')(data)),
  content: t('Process.body')(data)
})%>`,

    body: `<%= Node.inputPorts(data).map((a) => 'std::shared_ptr<' + t('Port.type')(a) + '> v_' + t('Port.name')(a) + ' = input_' + t('Port.name')(a) + ';').join('\\n') %>
  <%= Node.outputPorts(data).map((a) => 'std::shared_ptr<' + t('Port.type')(a) + '> v_' + t('Port.name')(a) + ';').join('\\n') %>
  <%= Node.get('code', data) %>
  <%= Node.outputPorts(data).map((a) => 'output_' + t('Port.name')(a) + ' = v_' + t('Port.name')(a) + ';').join('\\n') %>
`

  }
}
