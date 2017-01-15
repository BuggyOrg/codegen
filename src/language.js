
import merge from 'lodash/fp/merge'
import keyBy from 'lodash/fp/keyBy'
import glob from 'glob'
import {join, extname} from 'path'
import fs from 'fs'

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
  return keyBy('component', gatherNamedFiles(atomicsPath, true).map(renameProperty('name', 'component')))
}

function gatherTemplates (path) {
  const templatesPath = join(path, 'templates')
  return merge.apply(null, gatherNamedFiles(templatesPath)
    .map(renameProperty('name', 'template'))
    .map((temp) => require(join(__dirname, '../', temp.path))))
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
    throw new Error('Cannot get implementation for ' + node.componentId + ' in  language ' + Language.name(language))
  }
  return template(language.atomics[node.componentId], {variable: (name) => 'v_' + name})(node) 
}
