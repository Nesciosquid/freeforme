class ResponseCategory {
  constructor(name, header, placeholder, locked) {
    this.name = name;
    this.header = header;
    if (placeholder === undefined) {
      this.placeholder = false;
    } else this.placeholder = placeholder;
    if (locked === undefined) {
      this.locked = false;
    } else this.locked = locked;
    this.placeholder = placeholder;
    this.id = `category_${header}_${this.name}`;
    this.responseCount = 0;
    this.parent = null;
    this.childResponseTypes = {};
    this.childCategories = {};

    console.log(this.locked);
  }

  getResponseCount() {
    let sum = 0;
    Object.keys(this.childResponseTypes).forEach((typeKey) => {
      const type = this.childResponseTypes[typeKey];
      if (type != null) sum += type.getResponseCount();
    });
    Object.keys(this.childCategories).forEach((categoryKey) => {
      const category = this.childCategories[categoryKey];
      if (category != null) sum += category.getResponseCount();
    });
    return sum;
  }

  getResponseValue() {
    if (this.parent === null) return this.name;
    return this.parent.getResponseValue();
  }

  removeParent() {
    this.parent = null;
  }

  setParent(category) {
    this.parent = category;
  }

  getParent() {
    return this.parent;
  }

  getResponseTypes() {
    return this.childResponseTypes;
  }

  getChildCategories() {
    return this.childCategories;
  }

  setChildCategory(category) {
    this.childCategories[category.name] = category;
  }

  removeChildCategory(category) {
    this.childCategories[category.name] = null;
  }

  setChildResponseType(foo) {
    if (foo.getParent() != null) {
      foo.getParent().removeChildResponseType(foo);
    }
    this.childResponseTypes[foo.responseString] = foo;
    foo.setParent(this);
  }

  removeChildResponseType(responseType) {
    this.childResponseTypes[responseType.responseString] = null;
    responseType.removeParent();
  }
}

module.exports = ResponseCategory;
