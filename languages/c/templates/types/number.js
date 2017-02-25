module.exports = {
  Types: {
    Number: {
      definition: () => `Number(long v) : value(v) {}
  long value;`,
      copy: (other) => `return new Number(${other}.value);`,
      toString: (n) => `return std::string(std::to_string(${n}.value));`,
    }
  }
}
