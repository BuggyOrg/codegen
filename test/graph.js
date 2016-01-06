/* global describe, it */

import chai from 'chai'
import graphlib from 'graphlib'
import * as api from '../src/api.js'
import fs from 'fs'

const expect = chai.expect

describe('Graph processing', () => {
  it('lists all process nodes in a graph', () => {
    var graph = graphlib.json.read(JSON.parse(fs.readFileSync('test/fixtures/testgraph.graphlib')))
    var processes = api.listProcesses(graph)
    expect(processes).to.have.length(6)
  })
})