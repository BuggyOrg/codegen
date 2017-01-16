#!/usr/bin/env node

import * as cliExt from 'cli-ext'
import {generateCode} from './api'
import {packLanguage} from './language.js'
import {join, normalize} from 'path'
import yargs from 'yargs'

debugger
/* cliExt.input(process.argv[2])
.then((graphStr) => {
  var graph
  try {
    graph = JSON.parse(graphStr)
  } catch (err) {
    console.error('[codegen] Cannot parse input JSON.')
  }
  return generateCode(graph, 'c')
})
.then((res) => console.log(res))
.catch((err) => console.error(err.stack || err))
*/

global.wasCommand = false

const command = (fn) => {
  return function (...args) {
    global.wasCommand = true
    fn(...args)
  }
}

var argv = yargs
  .command('pack-language', 'Pack language information into a JSON document and print it.', { demand: 1 },
    command((yargs) => console.log(packLanguage(normalize(yargs._[1])))))
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
    return generateCode(graph, packLanguage(normalize('languages/javascript')))
  })
  .then((res) => console.log(res))
  .catch((err) => console.error(err.stack || err))
}
