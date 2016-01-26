
import _ from 'lodash'

require('babel-polyfill')

/** This function creates an iterable list of resolved nodes from a list of node ids.
 * @param {Array.<Node>} nodes A list of Nodes
 * @param {function(node)} resolve A generator function that creates an iterable set of nodes.
 * @return {generator}
 */
function * resolveNodeList (nodes, resolve) {
  for (var node in nodes) {
    var gen = resolve(node)
    yield gen.next()
  }
}

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
      .value()

  var processedNodes = {}
  var cur = nodes.pop()
  while (cur) {
    if (_.has(processedNodes, cur.meta)) {
      cur = nodes.pop()
      continue
    }
    processedNodes[cur.meta] = cur
    yield cur.meta
    if (cur.nodes) {
      var newItems = resolveNodeList(cur.nodes, resolve)
      var next = newItems.next()
      while (!next.done) {
        cur.push(next.value)
        next = newItems.next()
      }
    }
    cur = nodes.pop()
  }
}
