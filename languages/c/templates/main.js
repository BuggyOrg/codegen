module.exports = {
  prefix: () => {
    const structs = Graph.components(graph).filter(Types.isType)
    const compounds = Graph.compounds(graph)
    return `
#include <cstdlib>
#include <iostream>
#include <string>
#include <memory>
#include <functional>

${['String', 'IO', 'Number'].map((name) => t('Types.definition')(name)).join('\n')}

// datastructures...
${structs.map(t('Datastructures.definition')).join('\n')}

// definitions...
${compounds.map(t('Compound.declare')).join('\n')}
` },

  mainEntry: (graph) => `
int main (int argc, char** argv) {
  std::shared_ptr<IO> io(new IO());
  std::shared_ptr<IO> outIo;

  P_${t('Component.name')(graph)}(io, outIo);
  return 0;
}
`
}
