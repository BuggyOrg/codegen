function main() {

  const atomic_def = atomics(graph).map(atomic_process).join('\n\n')
  const compound_def = compounds(graph).map((node) => compound_process(node, graph)).join('\n\n')
  const main_name = compounds(graph).filter((n) => n.componentId === 'main')[0]

  return `#include <future>
#include <cstdlib>
#include <iostream>
#include <string>

typedef int Number;

struct String {
  String(std::string v) : value(v) {}
  std::string value;
};

struct IO {
  void print_string(const String &str) {
    std::cout << str.value;
  }
};

${ atomic_def }

${ compound_def }

int main(int argc, char *argv[])
{
  // Workaround: Need to create promise to get a future which is needed for the call to P_main.
  // In future sequential calls should directly take the value!
  std::promise<IO> out_from_here_IO;
  std::shared_future<IO> in_to_P_main_IO = out_from_here_IO.get_future().share();
  out_from_here_IO.set_value(IO());

  std::promise<IO> out_from_P_main_value;
  std::shared_future<IO> in_to_here_value = out_from_P_main_value.get_future().share();

  ${ func_name(main_name) }(in_to_P_main_IO, std::move(out_from_P_main_value));
  in_to_here_value.wait();

  return 0;
}`
}

function port_name(port) {
  return `${port.port}`
}
