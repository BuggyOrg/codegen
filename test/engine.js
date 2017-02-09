/* global describe, it */
/* eslint no-eval: 0 */

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import * as Language from '../src/language.js'
import BabelVM from '../src/babel-vm-engine'

chai.use(chaiAsPromised)
const expect = chai.expect

describe('Parse&Execution Engine', () => {
  it('Complains if a file is not parsable (with the filename)', () =>
    expect(Language.loadLanguages('./test/fixtures/broken', BabelVM({})))
      .to.be.rejectedWith(/main.js/))

  it('Complains if a file is not parsable (with the language name)', () =>
    expect(Language.loadLanguages('./test/fixtures/broken', BabelVM({})))
      .to.be.rejectedWith(/broken/))
})
