#!/usr/bin/env node

import * as cliExt from 'cli-ext'
import {generateExecutable} from './api'
import {packLanguages} from './language.js'
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
  .demand('l')
  .array('l')
  .command('pack-language', 'Pack language information into a JSON document and print it.', { demand: 1 },
    command((yargs) => packLanguages(yargs._.slice(1).map(normalize)).then((l) => console.log(JSON.stringify(l)))))
  .help()
  .argv

if (!global.wasCommand) {
  packLanguages(argv.l.map(normalize))
  .then((lang) =>
    cliExt.input(argv._[0])
    .then((graphStr) => {
      var graph
      try {
        graph = JSON.parse(graphStr)
      } catch (err) {
        console.error('[codegen] Cannot parse input JSON.')
      }
      return generateExecutable(graph, lang)
    }))
  .then((res) => console.log(res))
  .catch((err) => console.error(err.stack || err))
}
