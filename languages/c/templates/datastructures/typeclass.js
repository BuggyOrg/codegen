module.exports = {
  Datastructures: {
    typeclass: (struct) => `
struct ${t('Types.typeName')(struct.metaInformation.type)} {
  std::string subType;
  std::shared_ptr<void> data;
};`
  }
}
