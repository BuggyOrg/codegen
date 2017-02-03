module.exports = {
  Types: {
    IO: {
      definition: `struct IO {};

std::shared_ptr<IO> makeIO() {
  return std::shared_ptr<IO>(new IO());
}
`,

      copy: `
  printf("Cannot copy IO."); // impossible to copy IO.
  exit(EXIT_FAILURE);
  `
    }
  }
}
