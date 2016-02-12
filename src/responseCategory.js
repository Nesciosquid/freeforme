"use strict";

class ResponseCategory {
    constructor(name, header, placeholder){
        this.name = name;
        this.header = header;
        if (placeholder == undefined){
            placeholder = false;
        }
        this.placeholder = placeholder;
        this.id = "category_" + header + "_" + this.name;
        this.__responseCount = 0;
        this.__parent = null;
        this.__childResponseTypes = {};
        this.__childCategories = {};
    }

    getResponseCount(){
        let sum = 0;
        for (let i in this.__childResponseTypes){
            let type = this.__childResponseTypes[i];
            if (type != null){
                sum += type.getResponseCount();
            }
        }

        for (let i in this.__childCategories){
            let category = this.__childCategories[i];
            if (category != null){
                sum += category.getResponseCount();
            }
        }
        return sum;
    }

    getResponseValue(){
        if (this.__parent == null){
            return this.name;
        } else {
            return this.__parent.getResponseValue();
        }
    }

    removeParent(){
        this.__parent = null;
    }

    setParent(category){
        this.__parent = category;
    }

    getParent(category){
        return this.__parent;
    }

    getResponseTypes(){
        return this.__childResponseTypes;
    }

    getChildCategories(){
        return this.__childCategories;
    }

    setChildCategory(category){
        this.__childCategories[category.name] = category;
    }

    removeChildCategory(category){
        this.__childCategories[category.name] = null;
    }

    setChildResponseType(responseType){
        if (responseType.getParent() != null){
            responseType.getParent().removeChildResponseType(responseType);
        }
        this.__childResponseTypes[responseType.responseString] = responseType;
        responseType.setParent(this);
    }

    removeChildResponseType(responseType){
        this.__childResponseTypes[responseType.responseString] = null;
        responseType.removeParent();
    }
}

module.exports = ResponseCategory;