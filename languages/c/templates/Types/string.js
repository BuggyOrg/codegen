module.exports = {
  Types: {
    String: {
      definition: `struct String {
  unsigned int length;
  std::shared_ptr<char> data;
};
`,

      copy: `
  String* <%= variable(data.copy) %> = malloc(sizeof(String));
  <%= variable(data.copy) %>->length = <%= variable(data.origin) %>->length;
  <%= variable(data.copy) %>->data = std::shared_ptr<char>((char*)malloc(sizeof(char*) * <%= variable(data.origin) %>->length))
  memcpy(&(*<%= variable(data.copy) %>->data), <%= variable(data.origin) %>->data, sizeof(char) * (<%= variable(data.origin) %>->length + 1));
  `
    }
  }
}
