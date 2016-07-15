/* global describe, it */

import chai from 'chai'
import * as templ from '../src/templates.js'
import handlebars from 'handlebars'
import _ from 'lodash'

const expect = chai.expect

describe('Templating methods', () => {
  it('deregisters all helpers after usage', () => {
    var helperCnt = _.keys(handlebars.helpers).length
    templ.apply('', {}, {}, handlebars)
    expect(_.keys(handlebars.helpers)).to.have.length(helperCnt)
  })

  it('registers custom helpers before compilation', () => {
    templ.apply('{{help "a"}}', {}, {helpers: {help: (c) => 'P_' + c}})
  })

  it('registers partials before compilation', () => {
    expect(templ.apply('{{> partial}}', {}, {partials: {partial: 'p'}})).to.equal('p')
  })

  it('can apply partials to a context', () => {
    expect(templ.apply('{{#each list}}{{> p}}{{/each}}', {list: ['a', 'b']}, {partials: {p: '{{this}}'}})).to.equal('ab')
  })

  it('supports partials in partisl', () => {
    expect(templ.apply('{{> a}}', {}, {partials: {a: '{{> b}}', b: 'c'}})).to.equal('c')
  })

  describe('Custom Helpers', () => {
    it('defines concat', () => {
      expect(templ.apply('{{concat "a" "b"}}', {}, {})).to.equal('ab')
    })
  })
})
