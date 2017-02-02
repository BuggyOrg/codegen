module.exports = {
  includes: `
#include <memory>
#include <string.h>
`,

  makeIO: `
std::shared_ptr<IO> makeIO() {
  return new IO();
}
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
