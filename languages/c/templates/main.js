module.exports = {
  prefix: (graph) => `
#include <cstdlib>
#include <iostream>
#include <string>
#include <memory>

struct String {
  String(std::string v) : value(v) {}
  std::string value;
};
struct IO {
  void print_string(const String &str) {
    std::cout << str.value;
  }
};
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
