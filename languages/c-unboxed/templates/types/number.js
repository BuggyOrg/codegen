module.exports = {
  Types: {
    Number: {
      definition: () => `Number(double v) : value(v) {}
  double value;`,
      copy: (other) => `return ${other};`,
      toString: (n) => `return std::to_string(${n});`
    }
  }
}
