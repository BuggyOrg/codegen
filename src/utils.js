
import hash from 'object-hash'

export function sanitize (str) {
  if (typeof (str) !== 'string') {
    if (typeof JSON.stringify(str) !== 'string') {
      return '~non value~'
    }
    return sanitize(JSON.stringify(str))
  }
  // replace all but characters and numbers
  return str.replace(/([^0-9^A-Z^a-z_])/g, (c) => c.charCodeAt(0))
}

export function variable (name) {
  return 'v_' + name
}

export function componentName (node) {
  return sanitize(node.componentId +
    ((node.metaInformation && node.metaInformation.parameters) ? hash(node.metaInformation.parameters) : ''))
}

// thanks to ste2425
// http://stackoverflow.com/a/35056218
export function mapValuesDeep (cb, obj) {
  var out = {}

  Object.keys(obj).forEach(function (k) {
    var val

    if (obj[k] !== null && typeof obj[k] === 'object') {
      val = mapValuesDeep(cb, obj[k])
    } else {
      val = cb(obj[k], k)
    }

    out[k] = val
  })

  return out
}
