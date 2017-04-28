module.exports = {
  Datastructures: {
    array: (struct) => {
      return `
// Array
${JSON.stringify(struct, null, 2)}
`
    }
  }
}
