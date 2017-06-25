const operation2 = (node, op) => {
  const t1 = Node.inputPorts(node)[0].type
  const p1 = Node.inputPorts(node)[0].port
  const t2 = Node.inputPorts(node)[1].type
  const p2 = Node.inputPorts(node)[1].port
  const tOut = Node.outputPorts(node)[0].type
  const pOut = Node.outputPorts(node)[0].port
  if (tOut === 'Number') {
    return t('value')(tOut, pOut) + ' = ' + t('value')(t1, p1) + ' ' + op + ' ' + t('value')(t2, p2)
  } else {
    return  variable(pOut) + ' = ' + t('defType')(tOut, t('value')(t1, p1) + ' ' + op + ' ' + t('value')(t2, p2))
  }
}

module.exports = {
  'math/add': (node) => `
  ${operation2(node, '+')};
`,

  'math/multiply': (node) => `
  ${operation2(node, '*')};
`,

  'math/equal': (node) => `
  ${operation2(node, '==')};
`,

  'math/less': (node) => `
  ${operation2(node, '<')};
`
}
