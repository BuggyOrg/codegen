
import _ from 'lodash'

require('babel-polyfill')

export function isPortNode (node) {
  return node.nodeType === 'inPort' || node.nodeType === 'outPort'
}

export function isProcess (node) {
  return node.nodeType === 'process'
}

export function isComposite (node) {
  return node.atomic === false
}

export function processes (graph, resolve) {
  return _(graph.nodes()).chain()
    .map(n => graph.node(n))
    .filter(isProcess)
    .value()
}

export function * processNames (graph, resolve) {
  var nodes = _(graph.nodes()).chain()
      .map(n => graph.node(n))
      .filter(isProcess)
      .map(n => n.meta)
      .value()

  var processedNodes = {}
  var cur = nodes.pop()
  while (cur) {
    if (_.has(processedNodes, cur)) {
      cur = nodes.pop()
      continue
    }
    var fullNode = resolve(cur).next().value
    processedNodes[cur] = fullNode
    yield cur
    if (fullNode.nodes) {
      var newNodes = _.reject(fullNode.nodes, (n) => _.has(processedNodes, n.meta))
      nodes = _.union(nodes, newNodes)
    }
    cur = nodes.pop()
  }
}
