module.exports = {
  call: (node) => `
  (*v_fn)(v_result);
`,

  'functional/lambda': (node) => {
    const retType = Node.outputPorts(node)[0].type
    return `
  v_fn = ${t('defType')(retType, 'P_' + node.nodes[0].id.slice(1))};
`
  },

  'functional/partial': (node) => {
    const fnType = Node.outputPorts(node)[0].type
    const fnTypeName = t('Types.typeName')(fnType)
    const argNum = fnType.data[0].data.length + fnType.data[1].data.length
    const nArr = Array.apply(null, {length: argNum}).map(Number.call, Number)
    return `
  v_fn = ${t('defType')(fnTypeName,
    'std::bind(*v_inFn, v_value, ' + nArr.map((idx) => 'std::placeholders::_' + (idx + 1)).join(', ') + ')')};
`
  }
}
