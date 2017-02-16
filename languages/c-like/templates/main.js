module.exports = {
  main: (graph) => {

    const atomics = Graph.atomics(graph)
    const compounds = Graph.compounds(graph).concat(graph)

    return `
${t('prefix')(graph)}

// atomics
${atomics.map(t('Process.definition')).join('\n')}

// compounds...
${compounds.map(t('Compound.definition')).join('\n')}

${t('mainEntry')(graph)}
`
  },

  Atomic: (contents) => contents

}
