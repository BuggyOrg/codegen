#!/usr/bin/env node

import * as cliExt from 'cli-ext'
import {generateCode} from './api'

cliExt.input(process.argv[2])
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

