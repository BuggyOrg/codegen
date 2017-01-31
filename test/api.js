/* global describe, it */

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import * as graphAPI from '@buggyorg/graphtools'
import * as api from '../src/api.js'

chai.use(chaiAsPromised)

const expect = chai.expect

describe('API methods', () => {
  describe('Source code generation', () => {
    it('returns a string', () => {
      return expect(api.generateExecutable(graphAPI.empty(), {templates: {main: ''}}, {})).to.eventually.be.a('string')
    })
  })
})
