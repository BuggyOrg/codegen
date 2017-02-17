module.exports = {
  dep: () => 'dependent',
  activation: (context) => Node.isValid(context.data)
}
