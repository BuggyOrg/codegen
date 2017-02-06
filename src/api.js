
import * as Graph from '@buggyorg/graphtools'
import {sanitize, variable, componentName} from './utils'
import flatten from 'lodash/fp/flatten'
import * as Language from './language'
import {typeName} from './types'
import * as vm from 'vm'

const Node = Graph.Node

function atomics (graph) {
  return Graph.atomics(graph)
}

function compounds (graph) {
  return Graph.compounds(graph).concat(graph)
}

function structs (graph) {
  return Graph.components(graph).filter((c) =>
    c.type && c.metaInformation.isConstructor)
}

/**
 * @function
 * @name generateExecutable
 * @description
 * Creates the source code for an executable using the given graph in the specified language.
 * @param {PortGraph} graph The graph that contains the program.
 * @param {Language} language A language definition see [Language]{@link module:Language}.
 * @param {object} options An optional flag with specific translation properties.
 * @return {string} The source code of the program.
 */
export function generateExecutable (graph, language, options) {
  return addCode(graph, language, options)
  .then(generateTarget(language, 'main'))
}

const generateTarget = (language, target) => (graph) => {
  // We want that in every template, every other template is available. E.g we have three templates:
  // - main
  // - process
  // - edgeName
  //
  // now the main process should have access to the function process and edgeName, the process should have
  // access to the main and edgeName function and edgeName should have access to the other two. In this example
  // it seems unnecessary that edgeName has access to the other functions, but we do not want to specify any
  // dependencies in the general case. It is easier to allow every template to call every other template (and even itself).

  // TODO What about other targets (like typeImplementation)?

  const sandbox = {Node, sanitize, portArgument: (p) => p.port,
    Graph, flatten, atomics, compounds, structs, typeName, variable, componentName, graph,
    /* debug helpers */ console, JSON}
  const context = new vm.createContext(sandbox)

  for (const templateName in language.templates) {
    const template = language.templates[templateName]
    vm.runInContext(template.code, context, {filename: template.path})
  }

  return vm.runInContext(`(function() { return main() })`, context)()
}

function addCode (graph, language) {
  return Promise.resolve(atomics(graph)
    .reduce((gr, n) =>
      Graph.replaceNode(n, Node.set({code: codeFor(n, language)}, n), gr),
      graph))
}

export function codeFor (node, language) {
  if (!node.atomic) return
  if (node.atomic && node.type) return generateTarget(language, 'typeImplementation')(node)

  const script = Language.implementation(node, language)
  return vm.runInNewContext(script.code, {node}, {filename: script.path})
}
