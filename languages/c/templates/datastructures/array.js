module.exports = {
  Datastructures: {
    array: () => {
      return `
// Array
template <typename T>
struct Array {
  Array(const std::initializer_list<T> vA) : value(vA) {}
  Array(const std::vector<T> vA) : value(vA) {}
  std::vector<T> value;
};
`
    }
  }
}
