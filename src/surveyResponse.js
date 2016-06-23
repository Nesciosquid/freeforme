class SurveyResponse {
  constructor(data, headers) {
    this.responses = {};
    this.responseTypes = {};
    this.setupResponses(data, headers);
  }

  setupResponses(data, headers) {
    if (headers.length !== data.length) {
      throw new Error(`SurveyResponse headers has length ${headers.length}` +
      ` but data of length ${data.length}`);
    } else {
      headers.forEach((header, index) => {
        this.responses[header] = data[index];
      });
    }
  }

  setResponseType(header, responseType) {
    this.responseTypes[header] = responseType;
  }

  getResponseValue(header) {
    if (this.responses.hasOwnProperty(header)) {
      return this.responses[header];
    }
    throw new Error(
      `SurveyResponse has no response for header: ${header})`);
  }

  getResponseType(header) {
    if (this.responseTypes.hasOwnProperty(header)) {
      return this.responseTypes[header];
    }
    throw new Error(
      `SurveyResponse has no response type for header: ${header}`);
  }

  getCategorizedValue(header) {
    if (this.responseTypes.hasOwnProperty(header)) {
      return this.responseTypes[header].getResponseValue();
    }
    throw new Error(
      `SurveyResponse does not have a response type for header: ${header}`);
  }
}

module.exports = SurveyResponse;
