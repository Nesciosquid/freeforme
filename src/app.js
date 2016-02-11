"use strict";

var Papa = require("papaparse");
var Dragula = require("dragula");
var HTMLUtils = require("./htmlUtils.js");
var SurveyResponse = require("./SurveyResponse.js");
var ResponseType = require("./responseType.js");
var ResponseCategory = require("./responseCategory.js");

var allResponses = [];
var headers = [];
var responseTypes = {};
var responseCategories = {};
var data = [];

var drake = Dragula();

var responseIDsToObjects = {};
var categoryIDsToObjects = {};

var drakes = {};

function setupDragAndDropLoad(selector) {
        let dnd = new HTMLUtils.DnDFileController(selector, function(files) {
            var f = files[0];

            var reader = new FileReader();
            reader.onloadend = function(e) {
               processCSV(this.result);
            };
            try {
                reader.readAsText(f);
            } catch (err) {
                console.log("unable to load JSON: " + f);
            }
        });
    }

setupDragAndDropLoad("#drop");

function clear(){
    allResponses = [];
    headers = [];
    responseTypes = [];
    responseCategories = {};
    data = [];
    drakes = {};

    var lists = document.getElementById("lists");
    while (lists.firstChild) {
        lists.removeChild(lists.firstChild);
    }
}

function createHeaders(){
    headers = data[0]; 
    for (let i in headers){
        let header = headers[i];
        for (let j in headers){
            let compare = headers[j];
            if (i != j && header == compare){
                headers[j] = headers[j] + j;
            }
        }
    }
}

function processCSV(csv){
    clear();
    let processed = Papa.parse(csv);
    data = processed.data;
    createHeaders();
    createSurveyResponses();
    collateResponses();
    createDivs();
}

function updateCountBadge(element, count){
    element.getElementsByClassName("count-badge")[0].innerHTML = count;
}

function addCountBadge(element, count){
    var badge = document.createElement("span");
    HTMLUtils.addClass(badge, "count-badge");
    element.appendChild(badge);
    updateCountBadge(element, count);
}

function addResponseValue(element, value){
    let responseValue = document.createElement("span");
    responseValue.innerHTML = value;
    element.appendChild(responseValue);
}

function createResponseCard(responseType){
    document.createElement("div");
    let card = document.createElement("div");
    HTMLUtils.addClass(card, "response-card");
    card.setAttribute("id", responseType.id)
    addResponseValue(card, responseType.responseString);
    addCountBadge(card, responseType.getResponseCount());
    responseIDsToObjects[card.id] = responseType;
    return card;
}

function createCategoryDiv(responseCategory){
    let categoryDiv = document.createElement("div");
    let draggingDiv = document.createElement("div");
    draggingDiv.setAttribute("id", responseCategory.id);
    HTMLUtils.addClass(draggingDiv, "card-list");
    categoryDiv.appendChild(createCategoryTitle(responseCategory));
    categoryDiv.appendChild(draggingDiv);
    categoryIDsToObjects[draggingDiv.id] = responseCategory;
    return categoryDiv;
}

function getDraggingDiv(categoryDiv){
    return categoryDiv.getElementsByClassName("card-list")[0];
}

function createCategoryTitle(responseCategory){
    let title = document.createElement("span");
    title.innerHTML = responseCategory.name;
    HTMLUtils.addClass(title, "category-title");
    return title;
}

function createHeaderTitle(header){
    let title = document.createElement("span");
    title.innerHTML = header;
    HTMLUtils.addClass(title, "header-title");
    return title;
}

function createHeaderDiv(header){
    let headerDiv = document.createElement("div")
    headerDiv.appendChild(createHeaderTitle(header));
    HTMLUtils.addClass(header, "header-container");
    return headerDiv;
}

function initializeCategoryDiv(categoryDiv){
    let draggingDiv = getDraggingDiv(categoryDiv);
    let category = categoryIDsToObjects[draggingDiv.id];
    let responseTypes = category.getResponseTypes();
    for (let i in responseTypes){
        let type = responseTypes[i];
        let card = createResponseCard(type);
        draggingDiv.appendChild(card);
    }
}

function setupHeader(header){
    let headerDiv = createHeaderDiv(header);
    let newCategory = new ResponseCategory("Uncategorized", header, true);
    let allResponseTypes = responseTypes[header];
    for (let i in allResponseTypes){
        newCategory.setChildResponseType(allResponseTypes[i]);
    }
    let newCategoryDiv = createCategoryDiv(newCategory);
    initializeCategoryDiv(newCategoryDiv);
    headerDiv.appendChild(newCategoryDiv);
    let blankCategory = new ResponseCategory("New Category", header, true);
    let blankCategoryDiv = createCategoryDiv(blankCategory);
    headerDiv.appendChild(blankCategoryDiv);
    document.getElementById("lists").appendChild(headerDiv);
    drakes[header] = Dragula([getDraggingDiv(newCategoryDiv), getDraggingDiv(blankCategoryDiv)]);
}   

function createDivs(){
    for (let i in responseTypes){
        setupHeader(i);
    }
}

function collateResponses(){
    for (let i in headers){
        let header = headers[i];
        responseTypes[header] = {};
    }
    console.log(responseTypes);

    for (let i in allResponses){
        let response = allResponses[i];
        for (let j in headers){
            let header = headers[j];
            let responseValue = response.getResponseValue(header);
            let types = responseTypes[header];
            if (!types.hasOwnProperty(responseValue)){
                types[responseValue] = new ResponseType(responseValue, header);
            }
            let responseType = types[responseValue];
            responseType.addResponse(response);
        }
    }
}

function createSurveyResponses(){
   for (let i =1; i < data.length; i++){
        let row = data[i];
        allResponses.push(new SurveyResponse(row, headers));
   }
}