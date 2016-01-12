
import _ from 'lodash'

export function isPortNode (nodeName) {
  return nodeName.indexOf('_PORT_') !== -1
}

export function listProcesses (graph) {
  return _(graph.nodes()).chain()
    .reject(isPortNode)
    .map(n => graph.node(n))
    .map(n => n.meta)
    .unique()
    .value()
}
