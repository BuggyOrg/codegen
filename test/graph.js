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

describe('Graph processing', () => {
  it('lists all process nodes in a graph', () => {
    var graph = readFixture('testgraph.graphlib')
    var processes = api.processes(graph)
    expect(processes).to.have.length(5)
  })
  it('counts every process type only once', () => {
    var graph = readFixture('twice.dot')
    var processes = api.processNames(graph)
    expect(processes).to.have.length(1)
  })
  it('counts recursively defined process types only once ', () => {
    var graph = readFixture('recurse.dot')
    var processes = api.processNames(graph)
    expect(processes).to.have.length(1)
  })
})
