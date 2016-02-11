"use strict";

class ResponseCategory {
    constructor(name, header){
        this.name = name;
        this.header = header;
        this.id = "category_" + header + "_" + this.name;
        this.__responseCount = 0;
        this.__parent = null;
        this.__childResponseTypes = {};
        this.__childCategories = {};
    }

    getResponseCount(){
        let sum = 0;
        for (let i in this.__childResponseTypes){
            type = this.__childResponseTypes[i];
            if (type != null){
                sum += type.responseCount();
            }
        }

        for (let i in this.__childCategories){
            category = this.__childCategories[i];
            if (category != null){
                sum += category.getResponseCount();
            }
        }
    }

    setParent(category){
        this.__parent = category;
    }

    getParent(category){
        return this.__parent;
    }

    setChildCategory(category){
        this.__childCategories[category.name] = category;
    }

    removeChildCategory(category){
        this.__childCategories[category.name] = null;
    }

    setChildResponseType(responseType){
        this.__childResponseTypes[responseType.responseString] = responseType;
    }

    removeChildResponseType(responseType){
        this.__childResponseTypes[responseType.responseString] = null;
    }
}

module.exports = ResponseCategory;