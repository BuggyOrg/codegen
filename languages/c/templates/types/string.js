module.exports = {
  Types: {
    String: {
      definition: () => `  String(std::string v) : value(v) {}
  std::string value;`,

      copy: (other) => `  return new String(${other}.value);`,

      toString: (s) => `  return ${s}.value;`
    }
  }
}
