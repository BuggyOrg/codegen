
import * as Graph from '@buggyorg/graphtools'
import {sanitize, variable, componentName} from './utils'
import flatten from 'lodash/fp/flatten'
import * as Language from './language'
import * as vm from 'vm'
import * as Types from './types'

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
  .then(generateTarget(language, 'main', options))
}

const generateTarget = (language, target, options) => (graph) => {
  // We want that in every template, every other template is available. E.g we have three templates:
  // - main
  // - process
  // - edgeName
  //
  // now the main process should have access to the function process and edgeName, the process should have
  // access to the main and edgeName function and edgeName should have access to the other two. In this example
  // it seems unnecessary that edgeName has access to the other functions, but we do not want to specify any
  // dependencies in the general case. It is easier to allow every template to call every other template (and even itself).

  const sandbox = {Node, sanitize, portArgument: (p) => p.port,
    Graph, flatten, atomics, compounds, structs, Types, variable, componentName, graph,
    /* debug helpers */ console, JSON}
  const context = vm.createContext(sandbox)

  for (const templateName in language.templates) {
    const template = language.templates[templateName]
    vm.runInContext(template.code, context, {filename: template.path})
  }

  return vm.runInContext(`${target}`, context)(graph)
  //
  // We define templImports and use it inside the mapping below. The first argument of merge are the "always" available
  // functions (independent of the target language). Then we map over all templates of a given language and
  // create a function that takes a string (str, the template defined in the language) and an argument (the data)
  // and with those calls the template function. The imports are "templImport" (a closure to the just defined imports)
  // This is a bit tricky, but the template function is called here in a function, so it will use the value _after_ the
  // templImports object is completely defined. It would not work if we would write
  //
  // mapValues((str) => { var t = template(...); return (data) => t({data, graph})})
/*  const constMethods = {Node, sanitize, portArgument: (p) => p.port,
    Graph, flatten, atomics, compounds, structs, Types, variable, componentName,
    t: (name) => (data) => {
      try {
        return template(Language.template(name, language, {graph, options, imports: constMethods}), {imports: constMethods})({data, graph})
      } catch (err) {
        throw new Error('Problem while evaluating template "' + name + '"\n [' + err + ']')
      }
    }
  }
  try {
    return template(Language.template(target, language, {graph, options, imports: constMethods}), {imports: constMethods})({data: graph, graph})
  } catch (err) {
    throw new Error('Problem while evaluating template "' + target + '"\n [' + err + ']')
  }
  */
}

function addCode (graph, language, options) {
  return Promise.resolve(atomics(graph)
    .reduce((gr, n) =>
      Graph.replaceNode(n, Node.set({code: codeFor(n, language, options)}, n), gr),
      graph))
}

export function codeFor (node, language, options) {
  if (!node.atomic) return
  if (node.atomic && node.type) return generateTarget(language, 'Datastructures.typeImplementation', options)(node)
  return generateTarget(language, 'Atomic', Language.implementation(node, language, options))(node)
}
