const arrayInnerType = (arrayType) =>
  arrayType.data[0]

module.exports = {
  'array/first': (node) => {
    const outputType = t('Types.typeName')(Node.outputPorts(node)[0].type)
    return `${variable('val')} = ${t('defType')(outputType, '*' + t('value')('', 'inArray') + '[0]')};
`
  },

  'array/last': (node) => {
    const outputType = t('Types.typeName')(Node.outputPorts(node)[0].type)
    return `${variable('val')} = ${t('defType')(outputType, '*' + t('value')('', 'inArray') + '.back()')};
`
  },

  'array/rest': (node) => {
    const outputType = Node.outputPorts(node)[0].type
    const innerType = t('Types.typeName')(arrayInnerType(Node.outputPorts(node)[0].type))
    return `
  ${variable('outArray')} = ${t('defType')(outputType,
    'std::vector<' + innerType + '*>(' + t('value')('', 'inArray') + '.begin() + 1, ' + t('value')('', 'inArray') + '.end())')};
`
  },

  'array/butlast': (node) => {
    const outputType = Node.outputPorts(node)[0].type
    const innerType = t('Types.typeName')(arrayInnerType(Node.outputPorts(node)[0].type))
    return `
  ${variable('outArray')} = ${t('defType')(outputType,
    'std::vector<' + innerType + '*>(' + t('value')('', 'inArray') + '.begin(), ' + t('value')('', 'inArray') + '.end() - 1)')};
`
  },

  'array/push': (node) => `
  ${variable('outArray')} = std::shared_ptr<${t('Types.typeName')(node.ports[0].type)}>(new ${t('Types.typeName')(node.ports[0].type)}({}));
  for (int i = 0; i < ${t('value')('', 'inArray')}.size(); i++) {
     ${t('value')('', 'outArray')}.push_back(${t('Types.copyName')(node.ports[1].type)}(* ${t('value')('', 'inArray')}[i]));
  }
  // ${t('value')('', 'outArray')}.insert(${t('value')('', 'outArray')}.end(), ${t('value')('', 'inArray')}.begin(), ${t('value')('', 'inArray')}.end());
  ${t('value')('', 'outArray')}.push_back(${t('Types.copyName')(node.ports[1].type)}(*${variable('val')}));
`,

  'array/prepend': (node) => `
  ${variable('outArray')} = std::shared_ptr<${t('Types.typeName')(node.ports[0].type)}>(new ${t('Types.typeName')(node.ports[0].type)}({}));
  ${t('value')('', 'outArray')}.insert(${t('value')('', 'outArray')}.end(), ${t('value')('', 'inArray')}.begin(), ${t('value')('', 'inArray')}.end());
  ${t('value')('', 'outArray')}.insert(${t('value')('', 'outArray')}.begin(), *${variable('value')});
`,

  'array/concat': (node) => `
  ${variable('outArray')} = std::shared_ptr<${t('Types.typeName')(node.ports[0].type)}>(new ${t('Types.typeName')(node.ports[0].type)}({}));
  ${t('value')('', 'outArray')}.reserve(${t('value')('', 'inArray1')}.size() + ${t('value')('', 'inArray2')}.size());
  ${t('value')('', 'outArray')}.insert(${t('value')('', 'outArray')}.end(), ${t('value')('', 'inArray1')}.begin(), ${t('value')('', 'inArray1')}.end());
  ${t('value')('', 'outArray')}.insert(${t('value')('', 'outArray')}.end(), ${t('value')('', 'inArray2')}.begin(), ${t('value')('', 'inArray2')}.end());
  `,

  'array/length': (node) => `
  ${variable('length')} = ${t('defType')('Number', t('value')('', 'inArray') + '.size()')};
`,

  'Array': (node) => {
    const len = node.metaInformation.length
    const arrType = Node.outputPorts(node)[0].type
    const arrTN = t('Types.typeName')(arrType)
    const inputs = Array.apply(null, Array(len)).map((_, idx) => t('Types.copyName')(Node.inputPorts(node)[idx].type) + '(*' + variable('input') + idx + ')')
    return `
  ${variable('output')} = std::shared_ptr<${arrTN}>(new ${arrTN}({${inputs.join(', ')}}));
`
  },

  'array/map': (node) => {
    const arrInType = node.ports[0].type
    const arrOutType = node.ports[node.ports.length - 1].type
    const arrInTN = t('Types.typeName')(arrayInnerType(arrInType))
    const arrOutTN = t('Types.typeName')(arrayInnerType(arrOutType))
    return `
  std::vector<${arrInTN}*>& source = ${t('value')('', 'inArray')};
  std::vector<${arrOutTN}*> newArr;
  newArr.reserve(source.size());
  std::shared_ptr<${arrInTN}> inPtr;
  std::shared_ptr<${arrOutTN}> outPtr;
  for (uint i = 0; i < source.size(); i++) {
    inPtr = std::shared_ptr<${arrInTN}>(new ${arrInTN}(*source[i]));
    (*${variable('fn')})(inPtr, outPtr);
    newArr.push_back(${t('Types.copyName')(arrOutTN)}(*outPtr));
  }
  ${variable('outArray')} = std::shared_ptr<Array<${arrOutTN}*>>(new Array<${arrOutTN}*>(newArr));
`
  },

  'array/foldl': (node) => {
    const arrInType = node.ports[0].type
    const outType = node.ports[node.ports.length - 1].type
    const arrInTN = t('Types.typeName')(arrayInnerType(arrInType))
    const outTN = t('Types.typeName')(outType)
    return `
  std::vector<${arrInTN}*>& source = ${t('value')('', 'inArray')};
  ${variable('outValue')} = ${t('defType')(outTN, t('value')('', 'initial'))};
  std::shared_ptr<${arrInTN}> inPtr;
  for (uint i = 0; i < source.size(); i++) {
    inPtr = std::shared_ptr<${arrInTN}>(new ${arrInTN}(*source[i]));
    (*${variable('fn')})(${variable('outValue')}, inPtr, ${variable('outValue')});
  }
`
  },

  'array/filter': (node) => {
    const arrInType = node.ports[0].type
    const arrOutType = node.ports[node.ports.length - 1].type
    const arrInTN = t('Types.typeName')(arrayInnerType(arrInType))
    const arrOutTN = t('Types.typeName')(arrayInnerType(arrOutType))
    return `
  std::vector<${arrInTN}*>& source = ${t('value')('', 'inArray')};
  std::vector<${arrOutTN}*> newArr;
  std::shared_ptr<${arrInTN}> inPtr;
  std::shared_ptr<Bool> v_outPtr;
  for (uint i = 0; i < source.size(); i++) {
    inPtr = std::shared_ptr<${arrInTN}>(new ${arrInTN}(*source[i]));
    (*${variable('fn')})(inPtr, v_outPtr);
    if (${t('value')('', 'outPtr')}) {
      newArr.push_back(source[i]);
    }
  }
  ${variable('outArray')} = std::shared_ptr<Array<${arrOutTN}*>>(new Array<${arrOutTN}*>(newArr));
`
  }
}
