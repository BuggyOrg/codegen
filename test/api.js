/* global describe, it */

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import * as graphAPI from '@buggyorg/graphtools'
import * as api from '../src/api.js'
import {packLanguages} from '../src/language'

chai.use(chaiAsPromised)

const expect = chai.expect

describe('API methods', () => {
  describe('Source code generation', () => {
    it('returns a string', () => {
      return expect(packLanguages('./test/fixtures/emptyLang')
      .then((emptyLang) => api.generateExecutable(graphAPI.empty(), emptyLang, {}))).to.eventually.be.a('string')
    })

    it('returns a the correct contents', () => {
      return expect(packLanguages('./test/fixtures/emptyLang')
      .then((emptyLang) => api.generateExecutable(graphAPI.empty(), emptyLang, {}))).to.eventually.equal('main')
    })

    it('can process templates', () => {
      return expect(packLanguages('./test/fixtures/simpleTemplate')
      .then((tLang) => api.generateExecutable(graphAPI.empty(), tLang, {}))).to.eventually.equal('templates')
    })

    it('Supports extending languages', () => {
      return expect(packLanguages(['./test/fixtures/lang2', './test/fixtures/lang1'])
      .then((eLang) => api.generateExecutable(graphAPI.empty(), eLang, {}))).to.eventually.equal('t1-extended-content;t2-content')
    })

    it('Language features can be enabled dependent on their context', () => {
      return expect(packLanguages(['./test/fixtures/deplang2', './test/fixtures/lang1'])
      .then((eLang) => api.generateExecutable(graphAPI.empty(), eLang, {}))).to.eventually.equal('t1-dependent;t2-content')
    })

    it('Creates code for atomics correctly', () => {
      const graph = graphAPI.addNode(
        {componentId: 'atomic', ports: [{port: 'a', kind: 'input', type: 'Number'}], atomic: true}, graphAPI.empty())
      return expect(packLanguages('./test/fixtures/atomics')
      .then((eLang) => api.generateExecutable(graph, eLang, {}))).to.eventually.equal('<atomic-code>')
    })

    it('Can resolve base templates', () =>
      expect(packLanguages(['./test/fixtures/deplang3', './test/fixtures/lang3'])
      .then((eLang) => api.generateExecutable(graphAPI.empty(), eLang, {}))).to.eventually.equal('base:main'))

    it.only('Can resolve base templates multiple times', () =>
      expect(packLanguages(['./test/fixtures/deplang4', './test/fixtures/deplang3', './test/fixtures/lang3'])
      .then((eLang) => api.generateExecutable(graphAPI.empty(), eLang, {}))).to.eventually.equal('base4:base:main'))
  })
})
