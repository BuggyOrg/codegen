
import merge from 'lodash/fp/merge'
import keyBy from 'lodash/fp/keyBy'
import mapValues from 'lodash/fp/mapValues'
import glob from 'glob'
import {join, extname} from 'path'
import fs from 'fs'
import lTemplate from 'lodash/template'

function renameProperty (isKey, willBeKey) {
  return (obj) => {
    obj[willBeKey] = obj[isKey]
    delete obj[isKey]
    return obj
  }
}

function pathToName (basePath) {
  return (path) =>
    path.slice(basePath.length + 1, -extname(path).length)
}

function gatherNamedFiles (path, readContent) {
  return glob.sync(join(path + '/**/*.js'))
    .map((p) => ({name: pathToName(path)(p), path: p, contents: (readContent) ? fs.readFileSync(p, 'utf8') : undefined}))
}

function gatherAtomics (path) {
  const atomicsPath = join(path, 'atomics')
  return mapValues((v) => v.contents,
    keyBy('component', gatherNamedFiles(atomicsPath, true).map(renameProperty('name', 'component'))))
}

function gatherTemplates (path) {
  const templatesPath = join(path, 'templates')
  return gatherNamedFiles(templatesPath)
    .map(renameProperty('name', 'template'))
    .map((temp) => require(join(__dirname, '../', temp.path)))
    .reduce((obj, cur) => merge(obj, cur), {})
}

export function packLanguage (path) {
  return {
    atomics: gatherAtomics(path),
    templates: gatherTemplates(path),
    name: 'Javascript'
  }
}

export function name (language) {
  return language.name
}

export function hasImplementation (component, language) {
  return !!language.atomics[component]
}

export function implementation (node, language) {
  if (!hasImplementation(node.componentId, language)) {
    throw new Error('Cannot get implementation for ' + node.componentId + ' in  language ' + name(language))
  }
  try {
    return lTemplate(language.atomics[node.componentId], {imports: {variable: (name) => 'v_' + name}})(node)
  } catch (exc) {
    throw new Error('Error while compiling the code for the atomic: "' + node.componentId + '" (' + exc.message + ')')
  }
}

export function template (name, language) {
  return language.templates[name]
}
