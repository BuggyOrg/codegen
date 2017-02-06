/**
 * The language definition is a data store that contains information about the implementation of every atomic and
 * the necessary templates to create certain artifacts. Possible artifacts are
 *
 * - `main`: An executable that can be run and that has a goal specified by the main component of the graph.
 * - `library`: A library that exposes functions to other languages? (Not implemented)
 * @module Language
 */
import glob from 'glob'
import {join, extname, resolve, basename} from 'path'
import fs from 'fs'
import {variable} from './utils'
import * as babel from  'babel-core'

function renameProperty (isKey, willBeKey) {
  return (obj) => {
    obj[willBeKey] = obj[isKey]
    delete obj[isKey]
    return obj
  }
}

function mergeArrayIntoObject (array) {
  return Object.assign(...array)
}

function pathToName (basePath) {
  return (path) =>
    path.slice(basePath.length + 1, -extname(path).length)
}

function gatherNamedFiles (path) {
  return glob.sync(join(path + '/**/*.js'))
    .map((p) => ({[pathToName(path)(p)]: {path: p, code: babel.transformFileSync(p, {}).code}}))
}

function gatherAtomics (path) {
  const atomicsPath = join(path, 'atomics')
  return mergeArrayIntoObject(gatherNamedFiles(atomicsPath))
}

function gatherTemplates (path) {
  const templatesPath = join(path, 'templates')
  return mergeArrayIntoObject(gatherNamedFiles(templatesPath))
}

export function packLanguage (path) {
  const absolutePath = resolve(path)
  return {
    atomics: gatherAtomics(absolutePath),
    templates: gatherTemplates(absolutePath),
    name: basename(absolutePath)
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

  return language.atomics[node.componentId]
}

export function template (name, language) {
  return language.templates[name]
}
