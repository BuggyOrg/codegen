/* global describe, it */

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import * as Language from '../src/language.js'

chai.use(chaiAsPromised)
const expect = chai.expect

describe('Languages', () => {
  describe('Atomics', () => {
    it('Loads atomics for a language', () =>
      Language.packLanguage('./test/fixtures/lang1')
      .then((lang) => {
        ['a', 'sub/b'].map((a) => expect(Language.hasImplementation(a, lang)).to.be.true)
      }))

    it('Gets the code for an atomic', () =>
      Language.packLanguage('./test/fixtures/lang1')
      .then((lang) => {
        expect(Language.implementation({componentId: 'sub/b'}, lang)).to.match(/atomic_sub_b/)
      }))
  })

  it('Loads the settings for a language', () =>
    Language.packLanguage('./test/fixtures/lang1')
    .then((lang) => {
      expect(Language.name(lang)).to.equal('test-language-1')
    }))

  it('Fails to load a language if the settings.json is missing.', () =>
    expect(Language.packLanguage('./test/fixtures/non-existent')).to.be.rejectedWith(/Invalid language/))

  it('Complains if the language cannot be found', () =>
    expect(Language.loadLanguages(['./test/fixtures/deplang2', './TEST/NON_EXISTENT'])).to.be.rejectedWith(/NON_EXISTENT/))

  describe('Templates', () => {
    it('Loads all templates for a language', () =>
      Language.packLanguage('./test/fixtures/lang1')
      .then((lang) => {
        ;['T1.t1', 'T1.t2'].map((t) => expect(Language.hasTemplate(t, lang)).to.be.true)
        ;['S1.s1', 'S1.S2.s2'].map((t) => expect(Language.hasTemplate(t, lang), 'Can load templates in subdirectories.').to.be.true)
      }))
  })

  describe('Languages hierarchy', () => {
    it('Can create an hierarchy of languages', () =>
      Language.loadLanguages(['./test/fixtures/lang2', './test/fixtures/lang1'])
      .then((lang) => {
        expect(Language.template('T1.t1', lang), 'Overwrites base templates with new definitions.').to.equal('t1-extended-content')
        expect(Language.template('T1.t2', lang), 'Keeps not overwritten templates.').to.equal('t2-content')
      }))

    it('Has access to all atomics in the languages', () =>
      Language.loadLanguages(['./test/fixtures/lang2', './test/fixtures/lang1'])
      .then((lang) => {
        expect(Language.hasImplementation('a', lang)).to.be.true
        expect(Language.hasImplementation('c', lang)).to.be.true
      }))
  })

  describe('Dependent languages', () => {
    it('Resolves dependent templates', () =>
      Language.loadLanguages(['./test/fixtures/deplang1', './test/fixtures/lang1'])
      .then((lang) => {
        expect(Language.hasTemplate('T1.t1', lang)).to.be.true
        expect(Language.hasTemplate('dep.tdep', lang)).to.be.false
        expect(() => Language.templateBy('dep.tdep', lang)).to.throw(Error)
        expect(Language.hasTemplate('dep.tdep', lang, {activate: true})).to.be.true
        expect(Language.template('dep.tdep', lang, {activate: true})).to.be.ok
      }))

    it('Can use imports in activation string', () =>
      Language.loadLanguages(['./test/fixtures/deplang2', './test/fixtures/lang1'])
      .then((lang) => {
        expect(Language.hasTemplate('dep', lang)).to.be.false
        expect(Language.hasTemplate('dep', lang, {})).to.be.false
        expect(Language.hasTemplate('dep', lang, {imports: {Node: {isValid: () => true}}, data: {}})).to.be.true
      }))
  })
})
