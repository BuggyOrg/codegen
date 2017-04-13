module.exports = {
  call: (node) => `
  (*v_fn)(v_result);
`,

  'functional/lambda': (node) => `
  v_fn = std::shared_ptr<${t('Types.typeName')(Node.outputPorts(node)[0].type)}>(new ${t('Types.typeName')(Node.outputPorts(node)[0].type)}(P_${node.nodes[0].id.slice(1)}));
`,

  'functional/partial': (node) => {
    const fnType = Node.outputPorts(node)[0].type
    const fnTypeName = t('Types.typeName')(fnType)
    const argNum = fnType.data[0].data.length + fnType.data[1].data.length
    const nArr = Array.apply(null, {length: argNum}).map(Number.call, Number)
    return `
  v_fn = std::shared_ptr<${fnTypeName}>(new ${fnTypeName}(std::bind(*v_inFn, v_value,
    ${nArr.map((idx) => 'std::placeholders::_' + (idx + 1)).join(', ')})));
`
  }
}
