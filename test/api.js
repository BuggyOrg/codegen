/* global describe, it */

import chai from 'chai'
import {graph as graphAPI} from '@buggyorg/graphtools'
import * as api from '../src/api.js'
import {emptyClient} from './testUtils'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
const expect = chai.expect

describe('API methods', () => {
  describe('Source code generation', () => {
    it('Creates a promise', () => {
      return expect(api.generateCode(graphAPI.empty(), 'dummy', {client: emptyClient})).to.be.fulfilled
    })
  })
})
