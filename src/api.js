
import _ from 'lodash'

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

/**
 * Creates the source code for the given graph in the specified language.
 * @params {PortGraph} graph The graph that contains the program.
 * @params {string} language An identifier for the target language.
 * @params {object} options An optional flag with specific translation properties.
 * @return {string} The source code of the program.
 */
export function generateCode (graph, language, options) {
  return '<no code yet>'
}
