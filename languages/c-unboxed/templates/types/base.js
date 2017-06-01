module.exports = {
  Types: {
    copyName: (typeName) => `__copy_${sanitize(typeName)}`,
    toStringName: (typeName) => `__${sanitize(typeName)}_to_std__string`,

    definition: (typeName) => {
      if (typeName === 'Number') {
        return `typedef double Number;

${typeName} ${t('Types.copyName')(typeName)} (const ${typeName}& other) {
  ${t('Types.' + typeName + '.copy')('other')}
}

std::string ${t('Types.toStringName')(typeName)} (const ${sanitize(typeName)}& s) {
  ${t('Types.' + typeName + '.toString')('s')}
}
`
      } else return t('base')(typeName)
    }
  }
}
