
import * as Graph from '@buggyorg/graphtools'
import {sanitize} from './utils'
import template from 'lodash/template'
import negate from 'lodash/fp/negate'
import merge from 'lodash/fp/merge'
import flatten from 'lodash/fp/flatten'
import clone from 'lodash/fp/clone'
import mapValues from 'lodash/fp/mapValues'
import {process} from './templates/process'
import {compound, imports} from './templates/compound'
import * as Language from './language'

const Node = Graph.Node

export function atomics (graph) {
  return Graph.nodes(graph).filter(Node.isAtomic)
}

export function compounds (graph) {
  return Graph.nodes(graph).filter(negate(Node.isAtomic)).concat(graph)
}

/**
 * Creates the source code for the given graph in the specified language.
 * @params {PortGraph} graph The graph that contains the program.
 * @params {string} language An identifier for the target language.
 * @params {object} options An optional flag with specific translation properties.
 * @return {string} The source code of the program.
 */
export function generateCode (graph, language, options) {
  return addCode(graph, language, options)
  .then((graph) =>
    atomics(graph).map(generateProcessCode(graph)).join('\n') +
    compounds(graph).map(generateCompoundCode(graph)).join('\n') +
    'main({data: {print: console.log.bind(console)}, type: "IO"})')
}

const generateProcessCode = (graph) => (node) => {
  return template(process,
    {
      imports: {Node, sanitize, portArgument: (p) => p.port, Graph}
    })({node, graph})
}

const generateCompoundCode = (graph) => (node) => {
  const templImports = merge({Node, sanitize, portArgument: (p) => p.port, Graph, flatten},
    mapValues((v) => (data) => template(v, {imports: templImports})({data, graph}), imports))
  return template(compound,
    {
      imports: templImports
    })({node, graph})
}

export function addCode (graph, language) {
  return Promise.resolve(atomics(graph)
    .reduce((gr, n) =>
      Graph.replaceNode(n, Node.set({code: codeFor(n, language)}, n), gr),
      graph))
}

export function codeFor (node, language) {
  if (!node.atomic) return
  return Language.implementation(node, language)
}
