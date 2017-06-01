module.exports = {
  Types: {
    Number: {
      definition: () => `Number(double v) : value(v) {}
  double value;`,
      copy: (other) => `return new Number(${other}.value);`,
      toString: (n) => `return std::string(std::to_string(${n}.value));`
    },

    Int: {
      definition: () => `Int(int v) : value(v) {}
  int value;`,
      copy: (other) => `return new Int(${other}.value);`,
      toString: (n) => `return std::to_string(${n}.value);`
    }
  }
}
