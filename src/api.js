
import * as Graph from '@buggyorg/graphtools'
import {sanitize, variable, componentName} from './utils'
import flatten from 'lodash/fp/flatten'
import * as Language from './language'
import * as Types from './types'
import BabelVM from './babel-vm-engine'
import hash from 'object-hash'

const Node = Graph.Node

function atomics (graph) {
  return Graph.atomics(graph)
}

function compounds (graph) {
  return Graph.compounds(graph).concat(graph)
}

function structs (graph) {
  return Graph.components(graph).filter(Types.isType)
}

function createContext (graph, options, llang) {
  /* eslint-disable object-property-newline */
  return Object.assign({}, {Node, sanitize, portArgument: (p) => p.port,
    Graph, flatten, atomics, compounds, structs, Types, variable, hash, graph,
    console, JSON, componentName,
    // llang.lang is updated when the language is loaded to enable template on the just loaded language.
    // while creating the context, llang will be null!
    t: (name) => (data) => Language.template(name, llang.lang, {options, data, callStack: ((options || {}).callStack || [])})(data)})
  /* eslint-enable object-property-newline */
}

/**
 * @function
 * @name generateExecutable
 * @description
 * Creates the source code for an executable using the given graph in the specified language.
 * @param {PortGraph} graph The graph that contains the program.
 * @param {Language} language A (packaged) language definition see [Language]{@link module:Language}.
 * @param {object} options An optional flag with specific translation properties.
 * @return {Promise<string>} The source code of the program.
 */
export function generateExecutable (graph, language, options) {
  // a bit cheesy...
  var langObj = {lang: null} // we need this inside the context.. but get it afterwards..
  return Language.loadLanguages(language, BabelVM(createContext(graph, options, langObj)))
  .then((lang) => { langObj.lang = lang; return lang }) // we set the lang here.. after createing the context
  .then((lang) => addCode(graph, lang, options)
    .then(Language.template('main', lang, options)))
}

function addCode (graph, language, options) {
  return Promise.resolve(atomics(graph)
    .reduce((gr, n) =>
      Graph.replaceNode(n, Node.set({code: codeFor(n, language, options)}, n), gr),
      graph))
}

export function codeFor (node, language, options) {
  if (!node.atomic) return
  if (node.atomic && node.type) return Language.template('Datastructures.typeImplementation', language, options)(node)
  return Language.template('Atomic', language, {options, data: node})(Language.implementation(node, language, options))
}
