/**
 * The language definition is a data store that contains information about the implementation of every atomic and
 * the necessary templates to create certain artifacts. Possible artifacts are
 *
 * - `main`: An executable that can be run and that has a goal specified by the main component of the graph.
 * - `library`: A library that exposes functions to other languages? (Not implemented)
 * @module Language
 */
<<<<<<< 91e8eee3079632a83bba6f1567560a68ec62e815
=======
import merge from 'lodash/fp/merge'
import keyBy from 'lodash/fp/keyBy'
import mapValues from 'lodash/fp/mapValues'
import flatten from 'lodash/fp/flatten'
import find from 'lodash/fp/find'
import some from 'lodash/fp/some'
import get from 'lodash/fp/get'
import has from 'lodash/fp/has'
>>>>>>> (test) Testing language features.
import glob from 'glob'
import {join, extname, resolve, basename} from 'path'
import fs from 'fs'
import {variable} from './utils'
<<<<<<< 91e8eee3079632a83bba6f1567560a68ec62e815
import * as babel from  'babel-core'
=======
import promiseAll from 'promise-all'
>>>>>>> (test) Testing language features.

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

<<<<<<< 91e8eee3079632a83bba6f1567560a68ec62e815
export function packLanguage (path) {
  const absolutePath = resolve(path)
  return {
    atomics: gatherAtomics(absolutePath),
    templates: gatherTemplates(absolutePath),
    name: basename(absolutePath)
=======
function gatherSettings (path) {
  const settingsPath = join(path, 'settings.json')
  if (!fs.existsSync(settingsPath)) {
    return Promise.reject('Invalid language: Language has no `settings.json` [at ' + settingsPath + '].')
>>>>>>> (test) Testing language features.
  }
  return Promise.resolve(JSON.parse(fs.readFileSync(settingsPath, 'utf8')))
}

export function packLanguage (path) {
  return promiseAll({settings: gatherSettings(path), atomics: gatherAtomics(path), templates: gatherTemplates(path)})
  .then((res) =>
    [merge(res.settings, {
      atomics: res.atomics,
      templates: res.templates
    })])
}

/**
 * Returns a new language that uses a hierarchy of languages to resolve queries.
 */
export function hierarchy (pathArr) {
  return Promise.all(pathArr.map(packLanguage)).then((res) => flatten(res))
}

export function name (language) {
  return language[0].name
}

function atomicById (id, lang) {
  return lang.atomics[id]
}

function hasAtomic (component) {
  return (lang) => !!atomicById(component, lang)
}

export function hasImplementation (component, language, data) {
  return some(hasAtomic(component), activeLanguage(language, data))
}

export function implementation (node, language, data) {
  if (!hasImplementation(node.componentId, activeLanguage(language))) {
    throw new Error('Cannot get implementation for ' + node.componentId + ' in  language ' + name(language))
  }
  try {
    return lTemplate(atomicById(node.componentId, find(hasAtomic(node.componentId), activeLanguage(language, data))), {imports: {variable}})(node)
  } catch (exc) {
    throw new Error('Error while compiling the code for the atomic: "' + node.componentId + '" (' + exc.message + ')')
  }
}

function templateInLang (tmpl) {
  return (lang) => has(tmpl, lang.templates)
}

export function template (tmpl, language, data) {
  if (!hasTemplate(tmpl, activeLanguage(language, data), data)) {
    throw new Error('Cannot get template "' + tmpl + '" in language ' + name(language))
  }
  return get(tmpl, find(templateInLang(tmpl), activeLanguage(language, data)).templates)
}

export function hasTemplate (tmpl, language, data) {
  return some(templateInLang(tmpl), activeLanguage(language, data))
}

function activeLanguage (language, data) {
  return language.filter((lang) => {
    if (has('activate', lang)) {
      return data && (typeof (data) === 'object') && lTemplate('<%= ' + lang.activate + ' %>')({data})
    }
    return true
  })
}
