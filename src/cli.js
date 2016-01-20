#!/usr/bin/env node
/* global __dirname, process */

import program from 'commander'
import fs from 'fs'
import getStdin from 'get-stdin'
import graphlib from 'graphlib'
import {processes, processNames} from './api'

var graphlibFromString = (graphString) => {
  var graphObj = JSON.parse(graphString)
  return graphlib.json.read(graphObj)
}

var getGraph = (graph) => {
  if (graph) {
    return Promise.resolve(graphlibFromString(fs.readFileSync(graph, 'utf8')))
  } else {
    return getStdin().then(graphString => Promise.resolve(graphlibFromString(graphString)))
  }
}

program
  .version(JSON.parse(fs.readFileSync(__dirname + '/../package.json'))['version'])

program
  .command('processes [graph]')
  .description('list all processes from a typed network port graph')
  .action(graphFile => {
    getGraph(graphFile).then(graph => {
      console.log(processes(graph))
    })
  })

program
  .command('processnames [graph]')
  .alias('pn')
  .description('list only the meta name for every process')
  .action(graphFile => {
    getGraph(graphFile).then(graph => {
      console.log(processNames(graph))
    })
  })

program
  .command('tree [graph]')
  .description('diplays a tree indicating the load-dependencies')
  .action(graph => {
    console.log('list process tree for', graph)
  })

program
  .parse(process.argv)
/*
if (!program.typegraph) {
  console.error('No type conversion graph given')
}

try {
  var typeGraph = graphlib.json.read(JSON.parse(fs.readFileSync(program.typegraph)))

  var processGraph = str => {
    var graph = graphlib.json.read(JSON.parse(str))
    var typed = addTypeConversion(graph, typeGraph)
    return JSON.stringify(graphlib.json.write(typed))
  }

  if (program.graphfile) {
    var str = fs.readFileSync(program.graphfile)
    console.log(processGraph(str))
  } else {
    getStdin().then(str => {
      try {
        console.log(processGraph(str))
      } catch (e) {
        console.error(e)
      }
    })
  }
} catch (e) {
  console.error(e)
}
*/
