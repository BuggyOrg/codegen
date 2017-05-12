module.exports = {
  'std/const': (node) => {
    switch (Types.typeName(node.metaInformation.parameters.type).toLowerCase()) {
      case 'number':
        return `${variable('const')} = ${t('defType')('Number', node.metaInformation.parameters.value)};`
      case 'string':
        return `${variable('const')} = ${t('defType')('String', '"' + node.metaInformation.parameters.value + '"')};`
    }
    throw new Error('Constant Type not defined: ')
  },

  'std/split': (node) => `
  std::vector<String> res;
  std::string cur = "";
  std::string& input = ${t('value')('', 'str')};
  for (int i = 0; i < input.length(); i++) {
    if (input[i] == ' ') {
      res.push_back(String(cur));
      cur = "";
    } else {
      cur += input[i];
    }
  }
  res.push_back(String(cur));
  ${variable('text')} = std::shared_ptr<Array<String>>(new Array<String>(res));
`,

  'std/join': (node) => `
  std::vector<String>& input = ${t('value')('', 'inArray')};
  std::string res = "";
  for (int i = 0; i < input.size(); i++) {
    res += input[i].value;
    if (i != input.size() - 1) res += ' ';
  }
  ${variable('str')} = std::shared_ptr<String>(new String(res));
`
}
