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
      const emptyLang = [{templates: {main: ''}, name: ''}]
      return expect(api.generateExecutable(graphAPI.empty(), emptyLang, {})).to.eventually.be.a('string')
    })
  })
})
