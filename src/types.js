
export function constructorCode (type) {
  return ''
}

export function typeName (type) {
  if (typeof (type) === 'string') return type
  else return type.type.type
}

export function isConstructor (node) {
  return node.metaInformation && node.metaInformation &&
    node.metaInformation.datastructure && node.metaInformation.isConstructor
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
