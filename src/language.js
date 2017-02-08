/**
 * The language definition is a data store that contains information about the implementation of every atomic and
 * the necessary templates to create certain artifacts. Possible artifacts are
 *
 * - `main`: An executable that can be run and that has a goal specified by the main component of the graph.
 * - `library`: A library that exposes functions to other languages? (Not implemented)
 * @module Language
 */

import merge from 'lodash/fp/merge'
import flatten from 'lodash/fp/flatten'
import find from 'lodash/fp/find'
import some from 'lodash/fp/some'
import get from 'lodash/fp/get'
import has from 'lodash/fp/has'
import glob from 'glob'
import {join, extname} from 'path'
import fs from 'fs'
import promiseAll from 'promise-all'

function mergeArrayIntoObject (array) {
  // fails if the array is empty and there is no first argument
  return Object.assign({}, ...array)
}

function pathToName (basePath) {
  return (path) =>
    path.slice(basePath.length + 1, -extname(path).length)
}

function isLanguageDirectory (path) {
  return fs.existsSync(path) && fs.statSync(path).isDirectory()
}

function gatherNamedFiles (path) {
  return glob.sync(join(path + '/**/*.js'))
    .map((p) => ({[pathToName(path)(p)]: {path: p, code: fs.readFileSync(p, 'utf8')}}))
}

function gatherAtomics (path) {
  const atomicsPath = join(path, 'atomics')
  return mergeArrayIntoObject(
    gatherNamedFiles(atomicsPath))
}

function gatherTemplates (path) {
  const templatesPath = join(path, 'templates')
  return mergeArrayIntoObject(
    gatherNamedFiles(templatesPath))
}

function gatherSettings (path, engine) {
  const settingsPath = join(path, 'settings.json')
  if (!fs.existsSync(settingsPath)) {
    return Promise.reject('Invalid language: Language has no `settings.json` [at ' + settingsPath + '].')
  }
  return Promise.resolve(JSON.parse(fs.readFileSync(settingsPath, 'utf8')))
}

function packLanguage (path, engine) {
  return promiseAll({
    settings: gatherSettings(path, engine),
    atomics: gatherAtomics(path, engine),
    templates: gatherTemplates(path, engine)
  })
  .then((res) =>
    // each language is an array of language definitions / extensions. If we load exactly one language
    // pack it inside an array.
    [merge(res.settings, {
      atomics: res.atomics,
      templates: res.templates
    })])
}

/**
 * Creates a packaged language file from a sequence of languages. Note that the order in which the
 * languages are specified matters, i.e. languages that are defined earlier in the paths array
 * are the first to use when looking for an atomic or a template.
 */
export function packLanguages (paths, engine) {
  if (!Array.isArray(paths)) return packLanguages([paths], engine)
  return Promise.all(paths.map((p) => packLanguage(p, engine)))
}

/**
 * Each language may have an activation that is stored as an javascript expression inside the
 * `settings.json`. This must be parsed to run it at later stages.
 */
function parseActivation (settings, engine) {
  return (settings.activate)
  ? engine.activation(settings.activate)
  : engine.activation('true')
}

/**
 * Go through all templates and atomics and create the corresponding callable
 * functions from the package.
 */
function createCallables (language, engine) {
  return {
    activation: engine.exports(parseActivation(language, engine)),
    atomics: mergeArrayIntoObject(
      Object.keys(language.atomics).map((k) => engine.exports(language.atomics[k]))),
    templates: mergeArrayIntoObject(
      Object.keys(language.templates).map((k) => engine.exports(language.templates[k])))
  }
}

/**
 * Load a new language definition based on
 *  - a packed language definition (stored as .json files)
 *  - a language folder containing a settings.json and possibly some definitions
 *  - an array of the above
 *
 * The loaded language (which may consist of multiple extensions and language definitions) will load
 * the templates and implementations (of atomics) by the following laws.
 *
 *  1. If the language is activated or not. The settings.json can specify an activation strategy with which
 *     the language decides whether it is active or not. If no such rule is given, the language is always active.
 *     Otherwise the language will only be active if the given criteria is met. All defined templates and
 *     implementations will only load if the language is active.
 *  2. The order in the specified array. If the language is given as an array of extensions and language
 *     definitions it will use the first found template/implementation (of any active language, see 1.).
 *     The array defines a hierarchy of the languages.
 *
 * @params langs Specifier for the language(es) to load. This can be a path to a `.json` file or a
 * path to a language folder. This language folder must contain a settings.json and may contain
 * templates in a `templates` folder or atomics in an `atomics` folder.
 * It also can specify an array of the above.
 * @returns {Promise<Language>} A language composed of the languages specified in `langs`.
 * If any of the languages is invalid or pathes point to a non existent file it will reject with
 * an Error indicating which language is broken.
 */
export function loadLanguages (langs, engine) {
  if (!Array.isArray(langs)) return loadLanguages([langs], engine)
  return Promise.all(langs.map((l) => {
    if (typeof (l) === 'string' && isLanguageDirectory(l)) { // assume path to language folder
      return packLanguage(l, engine)
    } else if (typeof (l) === 'string') { // assume it is a packed language (i.e. a json file)
      try {
        return JSON.parse(fs.readFileSync(l, 'utf8'))
      } catch (err) {
        return Promise.reject(err)
      }
    } else if (Array.isArray(l)) {
      return Promise.all(l)
    } else {
      return l
    }
  })).then(flatten)
  .then((langs) => ({
    name: langs[0].name + ((langs.length > 1) ? '(+' + langs.length + ')' : ''),
    languages: langs,
    callables: langs.map((l) => createCallables(l, engine))
  }))
}

export function name (language) {
  return language.name
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
  if (!hasImplementation(node.componentId, activeLanguage(language, data))) {
    throw new Error('Cannot get implementation for ' + node.componentId + ' in  language ' + name(language))
  }
  try {
    // select extension that defines the atomic and search inside this language
    return atomicById(node.componentId, find(hasAtomic(node.componentId), activeLanguage(language, data)))(data)
  } catch (exc) {
    throw new Error('Error while compiling the code for the atomic: "' + node.componentId + '" (' + exc.message + ')')
  }
}

function templateInLang (tmpl) {
  return (lang) => has(tmpl, lang.templates)
}

/**
 * Returns the template string for the given template.
 * @example <caption>settings.json</caption>
 * {
 *  "name": "c-threading",
 *  // this is used inside the template function to determine whether to activate
 *  // this language extension. The `data` field is the object on which the template
 *  // is applied (usually the node).
 *  "activate": "data.inAThread === true"
 * }
 * @example <caption>main.js (in c-threading template)</caption>
 * // the contents of the main template in the C-threading language
 * module.exports = {
 *   main: `// c-threading main!`
 * }
 * @example
 * // this will use the "c-threading"" template for main
 * template('main', ['c-threading', 'c'], {data: {inAThread: true}})
 *
 * // this will _not_ use the "c-threading"" main template as it must be activated
 * // if the "c" template has an "activate" condition or no "main" template the
 * // next call will throw an exception
 * template('main', ['c-threading', 'c'])
 * // the "c-threading" extension must get activated explicitly!
 *
 * @params {String} tmpl The name of the template to generate.
 * @params {Language} language The language definition that contains the template.
 * @params [data] Optional context information that is used to determine what language features are
 * active.
 * @returns {String} The contents of the template in the first fitting language/language-extension defined.
 * @throws {Error} If no template with the given name could be found.
 */
export function template (tmpl, language, data) {
  if (!hasTemplate(tmpl, activeLanguage(language, data), data)) {
    throw new Error('Cannot get template "' + tmpl + '" in language ' + name(language))
  }
  return get(tmpl, find(templateInLang(tmpl), activeLanguage(language, data)).templates)
}

/**
 * Returns the whether the language defines the given template.
  * @example <caption>settings.json</caption>
 * {
 *  "name": "c-threading",
 *  // this is used inside the template function to determine whether to activate
 *  // this language extension. The `data` field is the object on which the template
 *  // is applied (usually the node).
 *  "activate": "data.inAThread === true"
 * }
 * @example <caption>main.js (in c-threading template)</caption>
 * // the contents of the main template in the C-threading language
 * module.exports = {
 *   main: `// c-threading main!`
 * }
 * @example
 * // this will use the "c-threading"" template for main and thus return true
 * hasTemplate('main', ['c-threading', 'c'], {data: {inAThread: true}})
 *
 * // this will _not_ use the "c-threading"" main template as it must be activated
 * // if the "c" template has an "activate" condition or no "main" template the
 * // next call will return false, otherwise true
 * template('main', ['c-threading', 'c'])
 * // the "c-threading" extension must get activated explicitly!
 *
 * @params {String} tmpl The name of the template to generate.
 * @params {Language} language The language definition that contains the template.
 * @params [data] Optional context information that is used to determine what language features are
 * active.
 * @returns {Boolean} True if the template is defined in any language/language-extension.
 */
export function hasTemplate (tmpl, language, data) {
  return some(templateInLang(tmpl), activeLanguage(language, data))
}

function activeLanguage (language, data) {
  if (!language.callables) return language // already selected active language
  return language.callables.filter((lang) => {
    try {
      return lang.activation(data)
    } catch (err) {
      return false
    }
  })
}
