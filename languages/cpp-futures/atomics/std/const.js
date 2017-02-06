switch (node.metaInformation.type) {
  case 'number':
    `arg_const.set_value(${ node.metaInformation.value });`
    break
  case 'string':
    `arg_const.set_value(${ node.metaInformation.type }(std::string("${node.metaInformation.value}")));`
    break
}
