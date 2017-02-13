module.exports = {
  main: (graph) => {

    const atomics = Graph.atomics(graph)
    const compounds = Graph.compounds(graph).concat(graph)
    const structs = Graph.components(graph).filter(Types.isType)

    return `
${t('prefix')(graph)}

// datastructures...
${structs.map(t('Datastructures.definition')).join('\n')}

// atomics
${atomics.map(t('Process.definition')).join('\n')}

// compounds...
${compounds.map(t('Compound.definition')).join('\n')}

${t('mainEntry')(graph)}
`
  },

  Atomic: (contents) => contents

}
