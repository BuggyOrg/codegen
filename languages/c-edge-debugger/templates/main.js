module.exports = {
  defineTypes: (graph) => {
    // const structs = Graph.components(graph).filter(Types.isType).filter(Types.isConstructor)
    return `
template <typename T>
class debug_shared_ptr : public std::shared_ptr<T> {
public:
  debug_shared_ptr() {}

  debug_shared_ptr(const std::shared_ptr<T>& other);
};

${t('base')()}

` },

// ${structs.map(Types.structureData).map((s) => s.name).map(t('defineSpecialization')).join('\n')}
// ${['String', 'IO'].map(t('defineSpecialization')).join('\n')}

  defineSpecialization: (typeName) => `
template <>
debug_shared_ptr<${typeName}>::debug_shared_ptr(const std::shared_ptr<${typeName}>& other) : std::shared_ptr<${typeName}>(other) {
  std::cout << "Copy: " << ${t('Types.toStringName')(typeName)}(*other) << std::endl;
}`

}
