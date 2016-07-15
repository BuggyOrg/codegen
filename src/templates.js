
import handlebars from 'handlebars'
import _ from 'lodash'
import * as helpers from './templates/helpers'

function clearHelpers (engine, customHelpers) {
  _.each(customHelpers, (h) => engine.unregisterHelper(h))
}

function cleanPartials (engine, partials) {
  _.each(partials, (p) => engine.unregisterPartial(p))
}

function registerHelpers (engine, userHelpers) {
  engine.registerHelper(helpers)
  if (userHelpers) {
    engine.registerHelper(userHelpers)
  }
  return _.concat(_.keys(helpers), _.keys(userHelpers))
}

function registerPartials (engine, partials) {
  _.each(partials, (source, name) => engine.registerPartial(name, source))
}

export function apply (template, data, options, engine) {
  engine = engine || handlebars
  var customHelper = registerHelpers(engine, options.helpers)
  registerPartials(engine, options.partials)
  var res = engine.compile(template)(data)
  cleanPartials(options)
  clearHelpers(engine, customHelper)
  return res
}
