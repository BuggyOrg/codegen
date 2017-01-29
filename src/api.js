
import * as Graph from '@buggyorg/graphtools'
import {sanitize, variable, componentName} from './utils'
import template from 'lodash/template'
import merge from 'lodash/fp/merge'
import flatten from 'lodash/fp/flatten'
import mapValues from 'lodash/fp/mapValues'
import * as Language from './language'
import {typeName} from './types'

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
  // We want that in every template, every other template is available. E.g we have tree templates:
  // - main
  // - process
  // - edgeName
  //
  // now the main process should have access to the function process and edgeName, the process should have
  // access to the main and edgeName function and edgeName should have access to the other two. In this example
  // it seems unnecessary that edgeName has access to the other functions, but we do not want to specify any
  // dependencies in the general case. It is easier to allow every template to call every other template (and even itself).
  //
  // We define templImports and use it inside the mapping below. The first argument of merge are the "always" available
  // functions (independent of the target language). Then we map over all templates of a given language and
  // create a function that takes a string (str, the template defined in the language) and an argument (the data)
  // and with those calls the template function. The imports are "templImport" (a closure to the just defined imports)
  // This is a bit tricky, but the template function is called here in a function, so it will use the value _after_ the
  // templImports object is completely defined. It would not work if we would write
  //
  // mapValues((str) => { var t = template(...); return (data) => t({data, graph})})
  const constMethods = {Node, sanitize, portArgument: (p) => p.port,
    Graph, flatten, atomics, compounds, structs, typeName, variable, componentName}
  const templImports = merge(constMethods,
    mapValues((str) => (data) => template(str, {imports: templImports})({data, graph}), language.templates))
  return template(Language.template(target, language), {imports: templImports})({data: graph})
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
  return Language.implementation(node, language)
}
