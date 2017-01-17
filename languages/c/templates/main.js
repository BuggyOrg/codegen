module.exports = {
  main: `
#include <memory>

struct IO {
};

<%= atomics(graph).map(process).join('\\n') %>
<%= compounds(graph).map(compound).join('\\n') %>

void P_main(std::shared_ptr<IO> io) {
}

int main (int argc, char** argv) {
  // create the IO context
  std::shared_ptr<IO> io(new IO());

  P_main(io);
  return 0;
}
`
}
