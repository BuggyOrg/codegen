module.exports = {
  datastructures: `<%= (data.metaInformation && data.metaInformation &&
    data.metaInformation.datastructure && data.metaInformation.isConstructor)
    ? struct(data.metaInformation.datastructure)
    : 'typedef ' + typeName(data.metaInformation.type) + ' void;' %>`,

  struct: `
struct <%= data.name %> {
<%= data.structure.contents.map(structField).join('\\n') %>
};
`,

  structField: `  std::shared_ptr<<%= data.type %>> <%= data.name %>;`,

  typeImplementation: ``, // `<%= ((data.metaInformation.isDestructor) ? destructor(data) : constructorCall(data)) %>`,

  constructorCall: `
  <%= constructorAssign({
    inputs: Node.inputPorts(data),
    output: Node.outputPorts(data)[0],
    type: data.metaInformation.datastructure
  }) %>
`,

  constructorAssign: `
  <%= variable(data.output.port) %> = std::shared_ptr<<%= data.type.name %>>((<%= data.type.name %>*)malloc(sizeof(<%= data.type.name %>)));
<%= data.inputs.map((p, idx) => fieldAssign({
  name: variable(p.port),
  index: idx,
  type: data.type,
  output: variable(data.output.port)
})).join('\\n') %>
`,

  destructor: `<%= destructorAssign({
    input: Node.inputPorts(data)[0],
    output: Node.outputPorts(data)[0],
    type: data.metaInformation.datastructure,
    parameter: data.metaInformation.parameter
  }) %>`,

  destructorAssign: `  <%= variable(data.output.port) %> = <%= variable(data.input.port) %>->arg<%= data.parameter %>;`,

  fieldAssign: `  <%= data.output %>->arg<%= data.index %> = <%= data.name %>;`
}
