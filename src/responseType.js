class ResponseType {
  constructor(responseString, header) {
    this.header = header;
    this.responseString = responseString;
    this.id = 'type_${this.header}_${this.responseString}';
    this.responseCount = 0;
    this.parent = null;
  }

  getName() {
    if (this.responseString === '') return '[NO RESPONSE]';
    return this.responseString;
  }

  getResponseValue() {
    let val = '';
    if (this.parent == null || this.parent.placeholder) {
      // return this.responseString;
      val = 'Uncategorized';
    } else {
      val = this.parent.getResponseValue();
    }
    return val;
  }

  addResponse(surveyResponse) {
    this.responseCount++;
    surveyResponse.setResponseType(this.header, this);
  }

  getResponseCount() {
    return this.responseCount;
  }

  getParent() {
    return this.parent;
  }

  setParent(responseCategory) {
    this.parent = responseCategory;
  }

  removeParent() {
    this.parent = null;
  }
}

module.exports = ResponseType;
