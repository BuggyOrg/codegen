module.exports = {
  prefix: (graph) => `
#include <cstdlib>
#include <iostream>
#include <string>
#include <memory>

${['String', 'IO'].map((name) => t('Types.definition')(name)).join('\n')}
`,

  mainEntry: (graph) => `
int main (int argc, char** argv) {
  std::shared_ptr<IO> io(new IO());
  std::shared_ptr<IO> outIo;

  P_main(io, outIo);
  return 0;
}
`
}
