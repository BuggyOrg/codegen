class SharedFutureBuilder {
  constructor(type, name) {
    this.type = type
    this.name = name
    this.suffix = ''
  }

  assign(varName) {
    this.suffix = ` = ${varName}`
    return this
  }

  assignFromPromise(promiseName) {
    this.suffix = ` = ${promiseName}.get_future().share()`
    return this
  }

  end() {
    this.suffix += ';'
    return this
  }

  build() {
    return `std::shared_future<${this.type}> ${this.name}${this.suffix}`
  }
}

class PromiseBuilder {
  constructor(type, name) {
    this.type = type
    this.name = name
    this.suffix = ''
  }

  end() {
    this.suffix += ';'
    return this
  }

  build() {
    return `std::promise<${ this.type }> ${ this.name }${ this.suffix }`
  }
}
