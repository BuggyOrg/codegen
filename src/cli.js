#!/usr/bin/env node

import * as cliExt from 'cli-ext'
import {generateExecutable} from './api'
import {loadLanguages} from './language.js'
import {normalize} from 'path'
import yargs from 'yargs'

global.wasCommand = false

const command = (fn) => {
  return function (...args) {
    global.wasCommand = true
    fn(...args)
  }
}

var argv = yargs
  .alias('l', 'language')
  .describe('l', 'Specify languages that should be used to create the code.')
  .array('l')
  .command('pack-language', 'Pack language information into a JSON document and print it.', { demand: 1 },
    command((yargs) => loadLanguages(yargs._.slice(1).map(normalize)).then((l) => console.log(JSON.stringify(l)))))
  .argv

if (!global.wasCommand) {
  var langPromise
  if (argv.l) {
    langPromise = loadLanguages(argv.l.map(normalize))
  } else {
    langPromise = loadLanguages([normalize('languages/javascript')])
  }
  langPromise.then((lang) =>
    cliExt.input(argv._[0])
    .then((graphStr) => {
      var graph
      try {
        graph = JSON.parse(graphStr)
      } catch (err) {
        console.error('[codegen] Cannot parse input JSON.')
      }
      if (argv.l) {
        return generateExecutable(graph, lang)
      } else {
        return generateExecutable(graph, lang)
      }
    }))
  .then((res) => console.log(res))
  .catch((err) => console.error(err.stack || err))
}
