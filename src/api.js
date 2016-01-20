
import _ from 'lodash'

export function isPortNode (node) {
  return node.nodeType === 'inPort' || node.nodeType === 'outPort'
}

export function isProcess (node) {
  return node.nodeType === 'process'
}

export function processes (graph, resolve) {
  return _(graph.nodes()).chain()
    .map(n => graph.node(n))
    .filter(isProcess)
    .value()
}

export function processNames (graph, resolve) {
  return _(graph.nodes()).chain()
    .map(n => graph.node(n))
    .filter(isProcess)
    .map(n => n.meta)
    .unique()
    .value()
}
