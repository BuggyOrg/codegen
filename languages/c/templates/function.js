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
        return data.inputs.map((p) => 'std::shared_ptr<' + p.type + '> input_' + p.port)
          .concat(data.outputs.map((p) => 'std::shared_ptr<' + p.type + '>& output_' + p.port)).join(', ')
      }
    }
  }
}
