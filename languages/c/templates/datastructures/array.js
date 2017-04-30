module.exports = {
  Datastructures: {
    array: () => {
      return `
// Array
template <typename T>
struct Array {
  Array(const std::initializer_list<T> vA) : v(vA) {}
  Array(const std::vector<T> vA) : v(vA) {}
  std::vector<T> v;
};
`
    }
  }
}
