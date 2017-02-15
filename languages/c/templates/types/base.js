module.exports = {
  Types: {
    copyName: (typeName) => `__copy_${typeName}`,
    toStringName: (typeName) => `__${typeName}_to_std__string`,

    definition: (typeName) => `
struct ${typeName} {
  ${t('Types.' + typeName + '.definition')()}
};

${typeName}* ${t('Types.copyName')(typeName)} (const ${typeName}& other) {
  ${t('Types.' + typeName + '.copy')('other')}
}

std::string ${t('Types.toStringName')(typeName)} (const ${typeName}& s) {
  ${t('Types.' + typeName + '.toString')('s')}
}
`
  }
}
