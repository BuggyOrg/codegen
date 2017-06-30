module.exports = {
  main: (graph) => {

    const atomics = Graph.atomics(graph).filter((n) => !Node.get('isRecursive', n))
    const compounds = Graph.compounds(graph)

    return `
${t('prefix')(graph)}

// atomics
${uniqBy(t('Component.name'), atomics).map(t('Process.definition')).join('\n')}

// compounds...
${uniqBy(t('Component.name'), compounds).map(t('Compound.definition')).join('\n')}

${t('mainEntry')(graph)}
`
  },

  Atomic: (contents) => contents

}
