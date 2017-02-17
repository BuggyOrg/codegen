module.exports = {
  dep: {
    tdep: () => 'dependent template',
    activation: (context) => (context && context.options && context.options.activate)
  }
}
