module.exports = {
  includes: `
#include <memory>
#include <cstdlib>
#include <string.h>
`,

  entry: `
int main (int argc, char** argv) {
  // create the IO context
  std::shared_ptr<IO> io(makeIO());
  std::shared_ptr<IO> outIo;

  P_main(io, outIo);
  return 0;
}
`
}
