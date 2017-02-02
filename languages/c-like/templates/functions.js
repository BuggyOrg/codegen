module.exports = {
  Function: {
    definition: `
<%= t('Function.begin')(data) %><%= data.content %><%= t('Function.end')(data) %>
`,

    prefix: `void`, // in C itself...
    postfix: ``, // in languages like go for the return value...

    begin: `<%= t('Function.prefix')() %> <%= data.prefix %><%= data.name %>(<%= data.arguments.join(', ') %>) <%= t('Function.postfix')(data) %> {`,

    end: `}`
  }
}
