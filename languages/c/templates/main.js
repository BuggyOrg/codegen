module.exports = {
  prefix: (graph) => `
#include <cstdlib>
`,

  mainEntry: (graph) => `
int main (int argc, char** argv) {
  return 0;
}
`
}
