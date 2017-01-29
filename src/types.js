
export function constructorCode (type) {
  return ''
}

export function typeName (type) {
  if (typeof (type) === 'string') return type
  else return type.type.type
}
