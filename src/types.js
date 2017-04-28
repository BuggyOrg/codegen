
export function constructorCode (type) {
  return ''
}

export function typeName (type) {
  if (typeof (type) === 'string') return type
  if (type.type && type.type.type) return type.type.type
  else return type.name
}

export function isConstructor (node) {
  return node.metaInformation &&
    node.metaInformation.datastructure && node.metaInformation.isConstructor
}

export function isArray (node) {
  return !!(node.metaInformation && node.metaInformation.isConstructor && node.componentId.indexOf('Array') === 0)
}

export function isDestructor (node) {
  return node.metaInformation && node.metaInformation.isDestructor
}

export function isTypeClass (node) {
  return !isConstructor(node) && !isDestructor(node)
}

export function isType (node) {
  return node.type
}

export function structureData (node) {
  return node.metaInformation.datastructure
}
