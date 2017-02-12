module.exports = {
  Process: {
    definition: (node) => {
      return t('Function.definition')({
        prefix: 'P_',
        name: t('Component.name')(node),
        inputs: Node.inputPorts(node),
        outputs: Node.outputPorts(node),
        content: t('Process.body')(node)
      }) + '\n'
    }
  }
}
