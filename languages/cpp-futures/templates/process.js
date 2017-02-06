function atomic_process(node) {
  return `${func_def(node)} {
  ${Node.get('code', node).split('\n').join('\n  ')}
}`
}
