module.exports = {
  main: `
#include <memory>
#include <string.h>

struct IO {
};

<%= atomics(graph).map(process).join('\\n') %>
<%= compounds(graph).map(compound).join('\\n') %>

int main (int argc, char** argv) {
  // create the IO context
  std::shared_ptr<IO> io(new IO());
  std::shared_ptr<IO> outIo;

  P_main(io, outIo);
  return 0;
}
`
}
