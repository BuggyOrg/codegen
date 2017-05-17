module.exports = {
  Types: {
    copyName: (typeName) => `__copy_${sanitize(typeName)}`,
    toStringName: (typeName) => `__${sanitize(typeName)}_to_std__string`,

    definition: (typeName) => `
struct ${sanitize(typeName)} {
  ${t('Types.' + typeName + '.definition')()}
};

${typeName}* ${t('Types.copyName')(typeName)} (const ${typeName}& other) {
  ${t('Types.' + typeName + '.copy')('other')}
}

std::string ${t('Types.toStringName')(typeName)} (const ${sanitize(typeName)}& s) {
  ${t('Types.' + typeName + '.toString')('s')}
}
`
  }
}
