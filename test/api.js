/* global describe, it */

import chai from 'chai'
import {graph as graphAPI} from '@buggyorg/graphtools'
import * as api from '../src/api.js'

const expect = chai.expect

describe('API methods', () => {
  describe('Source code generation', () => {
    it('returns a string', () => {
      return expect(api.generateCode(graphAPI.empty(), 'dummy', {})).to.be.a.string
    })
  })
})
