#!/usr/bin/env node

import * as cliExt from 'cli-ext'
import {generateExecutable} from './api'
import {packLanguage} from './language.js'
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
  .describe('l', 'Specify a language that should be used to create the code.')
  .command('pack-language', 'Pack language information into a JSON document and print it.', { demand: 1 },
    command((yargs) => console.log(JSON.stringify(packLanguage(normalize(yargs._[1]))))))
  .argv

if (!global.wasCommand) {
  cliExt.input(argv._[0])
  .then((graphStr) => {
    var graph
    try {
      graph = JSON.parse(graphStr)
    } catch (err) {
      console.error('[codegen] Cannot parse input JSON.')
    }
    if (argv.l) {
      return generateExecutable(graph, packLanguage(normalize(argv.l)))
    } else {
      return generateExecutable(graph, packLanguage(normalize('languages/javascript')))
    }
  })
  .then((res) => console.log(res))
  .catch((err) => console.error(err.stack || err))
}
