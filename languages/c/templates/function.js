module.exports = {
  Function: {
    definition: (data) =>
      t('Function.begin')(data) + data.content + t('Function.end')(data),

    begin: (data) =>
      `void ${data.prefix}${data.name} (${t('Function.arguments')(data)}) {\n`,

    end: (data) =>
      `\n}`,

    arguments: (data) => {
      if (data.arguments) {
        return data.arguments.map((a) => a.type + ' ' + a.port).join(', ')
      } else {
        return data.inputs.map(t('Function.Argument.input'))
          .concat(data.outputs.map(t('Function.Argument.output'))).join(', ')
      }
    },

    Argument: {
      input: (port) => `std::shared_ptr<${ port.type }> input_${ port.port }`,
      output: (port) => `std::shared_ptr<${ port.type }>& output_${ port.port }`,
    }
  }
}
