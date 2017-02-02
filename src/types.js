
export function constructorCode (type) {
  return ''
}

export function typeName (type) {
  if (typeof (type) === 'string') return type
  else return type.type.type
}

export function structureType (node) {
  if (node.metaInformation && node.metaInformation &&
    node.metaInformation.datastructure && node.metaInformation.isConstructor) {
    return 'Constructor'
  } else if (node.metaInformation && node.metaInformation.isDestructor) {
    return 'Destructor'
  } else {
    return 'TypeClass'
  }
}

export function structureData (node) {
  return node.metaInformation.datastructure
}
