module.exports = {
  Component: {
    name: `<%= componentName(data) %>`,
    arguments: `<%= JSON.stringify(Node.inputPorts(data, true).map((a) => 'std::shared_ptr<' + t('Port.type')(a) + '> input_' + t('Port.name')(a))
      .concat(Node.outputPorts(data, true).map((a) => 'std::shared_ptr<' + t('Port.type')(a) + '>& output_' + t('Port.name')(a)))) %>`
  }
}
