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

var headerDivs = {};

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
    addResponseValue(card, responseType.getName());
    addCountBadge(card, responseType.getResponseCount());
    responseIDsToObjects[card.id] = responseType;
    return card;
}

function createCategoryDiv(responseCategory){
    let categoryDiv = document.createElement("div");
    let draggingDiv = document.createElement("div");
    HTMLUtils.addClass(categoryDiv, "category");
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

function getCategoryTitle(categoryDiv){
    return categoryDiv.getElementsByClassName("category-title")[0];
}

function createCategoryTitle(responseCategory){
    let titleDiv = document.createElement("div");
    let title = document.createElement("span");
    title.innerHTML = responseCategory.name;
    titleDiv.appendChild(title);
    HTMLUtils.addClass(title, "category-title");
    HTMLUtils.addClass(titleDiv, "category-title-div");
    addCountBadge(titleDiv, responseCategory.getResponseCount());
    return titleDiv;
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
    HTMLUtils.addClass(headerDiv, "header-container");
    return headerDiv;
}

function updateDivCategory(categoryDiv, responseCategory){
    categoryDiv.id = responseCategory.id;
    let title = getCategoryTitle(categoryDiv.parentElement);
    title.innerHTML = responseCategory.name;
    categoryIDsToObjects[categoryDiv.id] = responseCategory;
}

function dragOntoNewCategory(categoryDiv, responseDiv, sourceDiv){
    HTMLUtils.removeClass(categoryDiv.parentElement, "blank-category");
    let responseType = responseIDsToObjects[responseDiv.id];
    let header = responseType.header;
    let newCategory = new ResponseCategory(responseType.getName(), header, false);
    updateDivCategory(categoryDiv, newCategory);
    let newBlankDiv = createBlankCategoryDiv(header);
    let headerDiv = headerDivs[header];
    headerDiv.appendChild(newBlankDiv);
    drakes[header].containers.push(getDraggingDiv(newBlankDiv));
    dragOntoCategory(categoryDiv, responseDiv, sourceDiv);
}

function dragOntoCategory(categoryDiv, responseDiv, sourceDiv){
    let category = categoryIDsToObjects[categoryDiv.id];
    let responseType = responseIDsToObjects[responseDiv.id];
    let sourceCategory = categoryIDsToObjects[sourceDiv.id];
    category.setChildResponseType(responseType);
    updateCountBadge(categoryDiv.parentElement, category.getResponseCount());
    updateCountBadge(sourceDiv.parentElement, sourceCategory.getResponseCount());
}

function createBlankCategoryDiv(header){
    let blankCategory = new ResponseCategory("New Category", header, true);
    let blankCategoryDiv = createCategoryDiv(blankCategory);
    HTMLUtils.addClass(blankCategoryDiv, "blank-category");
    return blankCategoryDiv;
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

function onDrop(el, target, source, sibling){
    console.log(target.parentElement);
    console.log(HTMLUtils.hasClass(target.parentElement, "blank-category"));
    if (HTMLUtils.hasClass(target.parentElement, "blank-category")){
        dragOntoNewCategory(target, el, source);
    } else {
        dragOntoCategory(target, el, source);
    }

    if (source.getElementsByClassName("response-card").length == 0){
        HTMLUtils.removeElement(source.parentElement);
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
    let blankCategoryDiv = createBlankCategoryDiv(header);
    headerDiv.appendChild(blankCategoryDiv);
    document.getElementById("lists").appendChild(headerDiv);
    headerDivs[header] = headerDiv;
    drakes[header] = Dragula([getDraggingDiv(newCategoryDiv), getDraggingDiv(blankCategoryDiv)]);
    drakes[header].on("drop", onDrop);
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