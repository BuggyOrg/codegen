module.exports = {
  call: (node) => `
  (*v_fn)(v_result);
`,

  'functional/lambda': (node) => `
  v_fn = std::shared_ptr<${t('Types.typeName')(Node.outputPorts(node)[0].type)}>(new ${t('Types.typeName')(Node.outputPorts(node)[0].type)}(P_${node.nodes[0].id.slice(1)}));
`
}
