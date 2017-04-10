module.exports = {
  Types: {
    Bool: {
      definition: () => `Bool(bool v) : value(v) {}
  bool value;`,
      copy: (other) => `return new Bool(${other}.value);`,
      toString: (n) => `return ${n}.value ? "true" : "false";`,
    }
  }
}
