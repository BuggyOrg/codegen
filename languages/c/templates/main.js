module.exports = {
  main: `
#include <memory>
#include <string.h>

struct IO {
};

struct String {
  unsigned int length;
  std::shared_ptr<char> data;
};

<%= structs(data).map(datastructures).join('\\n') %>

typedef SPair StringPair;

<%= atomics(data).map(process).join('\\n') %>
<%= compounds(data).map(compound).join('\\n') %>

int main (int argc, char** argv) {
  // create the IO context
  std::shared_ptr<IO> io(new IO());
  std::shared_ptr<IO> outIo;

  P_main(io, outIo);
  return 0;
}
`
}
