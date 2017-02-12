module.exports = {
  Process: {
    body: (node) =>`${t('Process.prefix')(node)}
  ${Node.get('code', node)(node)}
${t('Process.postfix')(node)}`,

    prefix: (node) =>
      Node.inputPorts(node).map((a) => '  std::shared_ptr<' + Types.typeName(a.type) + '> v_' + a.port + ' = input_' + a.port + ';').join('\n') +
      Node.outputPorts(node).map((a) => '  std::shared_ptr<' + Types.typeName(a.type) + '> v_' + a.port + ';').join('\n'),

    postfix: (node) => Node.outputPorts(node).map((a) => '  output_' + a.port + ' = v_' + a.port + ';').join('\n')
  }
}
