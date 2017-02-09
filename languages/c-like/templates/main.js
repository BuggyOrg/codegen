module.exports = {
  main: (graph) => {
    return `
${t('prefix')(graph)}

// datastructures...

// atomics...

// compounds...

${t('mainEntry')(graph)}
`
  },

  Atomic: (contents) => contents

}
