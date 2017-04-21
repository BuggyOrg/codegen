module.exports = {
  Process: {
    prefix: (node) => `
  ${t('base')(node)}
  std::cout << "Function call to: \\"${t('Component.name')(node)}\\"" << std::endl;
`
  }
}
