/**
 * Babel VM based engine for loading and processing language files.
 * This engine loads files via babel to support new language features
 * and executes the files in the node VM.
 */

import * as vm from 'vm'
import * as babel from 'babel-core'

export default (context) => ({
  activation: (code) => 'module.exports = (' + code + ')',
  exports: (code, path) =>
    vm.runInNewContext('((module) => { ' +
      babel.transform(code, {filename: path}).code + ' \n ;return module})',
      Object.freeze(context), {filename: path})({}).exports
})
