module.exports = {
  Types: {
    IO: {
      definition: () => `  void print_string(const String &str) {
    std::cout << str.value;
  }

  void scan_string(String &str) {
    std::getline(std::cin, str.value);
  }
`,

      copy: (other) => `  throw "Cannot copy IO";`,

      toString: (io) => `  return "<IO>";`
    }
  }
}
