module.exports = {
  prefix: () => {
    const structs = Graph.components(graph).filter(Types.isType)
    return `
#include <cstdlib>
#include <iostream>
#include <string>
#include <memory>

${['String', 'IO', 'Number'].map((name) => t('Types.definition')(name)).join('\n')}

// datastructures...
${structs.map(t('Datastructures.definition')).join('\n')}
` },

  mainEntry: (graph) => `
int main (int argc, char** argv) {
  std::shared_ptr<IO> io(new IO());
  std::shared_ptr<IO> outIo;

  P_main(io, outIo);
  return 0;
}
`
}
