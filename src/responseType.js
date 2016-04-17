"use strict";

class ResponseType {
    constructor(responseString, header){
        this.header = header;
        this.responseString = responseString;
        this.id = "type_" + this.header + "_" + this.responseString;
        this.__responseCount = 0;
        this.__parent = null;
    }

    getName(){
        if (this.responseString == ""){
            return "[NO RESPONSE]";
        } else {
            return this.responseString;
        }
    }

    getResponseValue(){
        let val = "";
        console.log(this.__parent);
        if (this.__parent == null || this.__parent.placeholder){
            //return this.responseString;
            val = "Uncategorized";
        } else {
            val = this.__parent.getResponseValue();
        }
        console.log("Value: " + val);
        return val;
    }

    addResponse(surveyResponse){
      this.__responseCount++;
      surveyResponse.setResponseType(this.header, this);
    }

    getResponseCount(){
        return this.__responseCount;
    }

    getParent(){
        return this.__parent;
    }

    setParent(responseCategory){
        this.__parent = responseCategory;
    }

    removeParent(){
        this.__parent = null;
    }
}

module.exports = ResponseType;