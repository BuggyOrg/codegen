module.exports = {
  Function: {
    definition: `
<%= Function.begin(data) %>
  <%= data.contents %>
<%= Function.end(data) %>
`,

    prefix: `void`, // in C itself...
    postfix: ``, // in languages like go for the return value...

    begin: `<%= Function.prefix() %> <%= data.prefix %><%= data.name %>(<%= data.arguments.join(', ') %>) <%= Function.postfix(data) %> {`,

    end: `}`
  }
}
