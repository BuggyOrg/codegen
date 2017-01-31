module.exports = {
  Datastructures: {
    definition: `<%=
    (() => {
      switch (structureType(data)) {
        case 'Constructor':
          return Datastructures.struct(structureData(data))
        case 'TypeClass':
          return Datastructures.typeclass(data)
      }
    }
    )()`,

    struct: `
struct <%= data.name %> {
<%= data.structure.contents.map(structField).join('\\n') %>
};`,

    structField: `  std::shared_ptr<<%= data.type %>> <%= data.name %>;`,

    typeclass: `typedef <%= typeName(data.metaInformation.type) %> void;' %>`,

    typeImplementation: `
<%= (() => {
  switch (structureType(data)) {
    case 'Constructor':
      return Datastructures.constructorCall(data)
    case 'Destructor':
      return Datastructures.destructor(data)
  })() %>`,

    // cannot use constructor here as javascript sometimes also uses constructor in its objects..
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
}
