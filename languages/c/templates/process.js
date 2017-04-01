module.exports = {
  Process: {
    body: (node) => {
      const atomicFn = Node.get('code', node)
      if (typeof (atomicFn) !== 'function') throw new Error('Missing code for atomic: "' + node.componentId + '"')
      return `${t('Process.prefix')(node)}
  ${atomicFn(node)}
${t('Process.postfix')(node)}`
    },

    prefix: (node) =>
      Node.inputPorts(node).map((a) => '  std::shared_ptr<' + t('Types.typeName')(a.type) + '> v_' + a.port + ' = input_' + a.port + ';').join('\n') +
      Node.outputPorts(node).map((a) => '  std::shared_ptr<' + t('Types.typeName')(a.type) + '> v_' + a.port + ';').join('\n'),

    postfix: (node) => Node.outputPorts(node).map((a) => '  output_' + a.port + ' = v_' + a.port + ';').join('\n')
  }
}
