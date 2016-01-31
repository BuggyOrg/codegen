/* global describe, it */

import chai from 'chai'
import graphlib from 'graphlib'
import gdot from 'graphlib-dot'
import * as api from '../src/api.js'
import fs from 'fs'
import fileExtension from 'file-extension'

const expect = chai.expect

var readFixture = (file) => {
  if (fileExtension(file) === 'dot') {
    return gdot.read(fs.readFileSync('test/fixtures/' + file, 'utf8'))
  } else {
    return graphlib.json.read(JSON.parse(fs.readFileSync('test/fixtures/' + file)))
  }
}

var genToArray = (gen) => {
  var arr = []
  var next = gen.next()
  while (!next.done) {
    arr.push(next.value)
    next = gen.next()
  }
  return arr
}

describe('Graph processing', () => {
  it('lists all process nodes in a graph', () => {
    var graph = readFixture('testgraph.graphlib')
    var processes = api.processes(graph)
    expect(processes).to.have.length(5)
  })
  it('returns an error if a process cannot be found', () => {
    var resolve = function * (name) {
      throw new Error('could not find ' + name + ' in known processes list')
    }
    var graph = readFixture('plus2.dot')
    var gen = api.processNames(graph, resolve)
    var fn = gen.next
    expect(fn).to.throw(Error)
  })
  it('counts every process type only once', () => {
    var graph = readFixture('plus2.dot')
    var resolve = function * (name) {
      if (name === 'math/inc') {
        yield {meta: 'math/inc', atomic: true}
      } else {
        yield graph.node(name)
      }
    }
    var processes = genToArray(api.processNames(graph, resolve))
    expect(processes).to.have.length(1)
  })
  it('counts recursively defined process types only once ', () => {
    var graph = readFixture('recurse.dot')
    var resolve = function * (name) {
      yield graph.node(name)
    }
    var processes = genToArray(api.processNames(graph, resolve))
    expect(processes).to.have.length(1)
  })
  it('uses the resolve generator function on composite nodes', () => {
    const lib = {
      a: {meta: 'a', nodes: ['b']},
      b: {meta: 'b', nodes: ['c'], atomic: false},
      c: {meta: 'c', nodes: ['a']}
    }
    var resolve = function * (name) {
      yield lib[name]
    }
    var graph = readFixture('composites.dot')
    var processes = genToArray(api.processNames(graph, resolve))
    expect(processes).to.have.length(3)
  })
})
