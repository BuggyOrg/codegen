module.exports = {
  prefix: (graph) => {
    return `${t('base')()}

template <typename T>
class debug_shared_ptr : public std::shared_ptr<T> {
public:
  debug_shared_ptr() {}

  debug_shared_ptr(const std::shared_ptr<T>& other);
};

template <>
debug_shared_ptr<String>::debug_shared_ptr(const std::shared_ptr<String>& other) : std::shared_ptr<String>(other) {
  std::cout << "Copy: " << ${t('Types.toStringName')('String')}(*other) << std::endl;
}

template <>
debug_shared_ptr<IO>::debug_shared_ptr(const std::shared_ptr<IO>& other) : std::shared_ptr<IO>(other) {
}
`
  }
}
