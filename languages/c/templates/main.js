module.exports = {
  prefix: () => {
    const structs = Graph.components(graph).filter(Types.isType)
    const constructors = structs.filter(Types.isConstructor)
    const typeClasses = structs.filter(Types.isTypeClass)
    const compounds = Graph.compounds(graph)
    return `
#include <cstdlib>
#include <iostream>
#include <string>
#include <memory>
#include <functional>
#include <vector>

${t('defineTypes')()}

// datastructures...
${structs.map(t('Datastructures.preDefine')).join('\n')}
${structs.map(t('Datastructures.declaration')).join('\n')}
${constructors.map(t('Datastructures.definition')).join('\n')}
${typeClasses.map(t('Datastructures.definition')).join('\n')}

${t('Datastructures.array')()}

// definitions...
${compounds.map(t('Compound.declare')).join('\n')}
` },

  defineTypes: () =>
    ['String', 'IO', 'Number', 'Bool'].map((name) => t('Types.definition')(name)).join('\n'),

  mainEntry: (graph) => `
int main (int argc, char** argv) {
  ${t('dataType')('IO')} io(new IO());
  ${t('dataType')('IO')} outIo;

  P_${t('Component.name')(graph)}(io, outIo);
  return 0;
}
`
}
