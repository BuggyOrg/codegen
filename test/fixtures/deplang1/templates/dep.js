module.exports = {
  dep: {
    tdep: () => 'dependent template',
    activation: (context) => context.options.activate === true
  }
}
