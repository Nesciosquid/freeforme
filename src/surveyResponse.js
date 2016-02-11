"use strict";

class SurveyResponse {
    constructor(data, headers){
        this.responses = {};
        this.responseTypes = {};
        this.setupResponses(data, headers);
    }

    setupResponses(data, headers){
        if (headers.length != data.length){
            throw new Error("SurveyResponse headers has length " + headers.length + " but data of length " + data.length + ".");
        } else {
            for (var i in headers){
            var header = headers[i];
            this.responses[header] = data[i];
            }
        }
    }

    setResponseType(header, responseType){
        this.responseTypes[header] = responseType;
    }

    getResponseValue(header){
        if (this.responses.hasOwnProperty(header)){
            return this.responses[header];
        }
        else throw new Error("SurveyResponse does not have a response for header: "+ header);
    }

    getResponseType(header){
        if (this.responseTypes.hasOwnProperty(header)){
            return this.responseTypes[header];
        }
        else throw new Error("SurveyResponse does not have a response type for header:" + header);
    }
}

module.exports = SurveyResponse;