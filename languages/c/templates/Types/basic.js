module.exports = {
  Types: {
    definition: `
<%= ['String', 'IO'].map((type) => t('Types.' + type + '.definition')(data)).join('\\n') %>
`
  }
}
