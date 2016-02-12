"use strict";

var Papa = require("papaparse");
var Dragula = require("dragula");
var HTMLUtils = require("./htmlUtils.js");
var SurveyResponse = require("./SurveyResponse.js");
var ResponseType = require("./responseType.js");
var ResponseCategory = require("./responseCategory.js");
var Examples = require("./examples.js");

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

function setupSaveButton(){
    let button = document.getElementById("save-button");
    button.addEventListener("click", saveCSV);
}

function setupCompressButton(){
    let button = document.getElementById("compress-button");
    button.addEventListener("click", compressCategories);
}

function setupButtons(){
    setupSaveButton();
    setupCompressButton();
}

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
setupButtons();

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
    let title = document.createElement("h5");
    let titleSpan = document.createElement("span");
    HTMLUtils.addClass(titleSpan, "category-title-span");
    titleSpan.innerHTML = responseCategory.name;
    titleDiv.appendChild(title);
    HTMLUtils.addClass(title, "category-title");
    HTMLUtils.addClass(titleDiv, "category-title-div");
    title.appendChild(titleSpan);
    addCountBadge(title, responseCategory.getResponseCount());
    return titleDiv;
}

function createHeaderTitle(header){
    let title = document.createElement("h2");
    //title.innerHTML = "Column " + headers.indexOf(header) + ": " + header;
    title.innerHTML = header;
    HTMLUtils.addClass(title, "header-div-title");
    return title;
}

function createHeaderDiv(header){
    let headerDiv = document.createElement("div")
    headerDiv.appendChild(createHeaderTitle(header));
    HTMLUtils.addClass(headerDiv, "header-container");
    headerDiv.appendChild(createCategoryRow());
    return headerDiv;
}

function createCategoryRow(){
    let row = document.createElement("div");
    HTMLUtils.addClass(row, "row");
    row.appendChild(createLeftCategoryHolder());
    row.appendChild(createRightCategoryHolder());
    return row;
}

function addLeftCategory(headerDiv, categoryDiv){
    headerDiv.getElementsByClassName("left-category-holder")[0].appendChild(categoryDiv);
}

function removeLeftCategory(headerDiv, categoryDiv){
    headerDiv.getElementsByClassName("left-category-holder")[0].removeChild(categoryDiv);
}

function addRightCategory(headerDiv, categoryDiv){
    HTMLUtils.addClass(categoryDiv, "floating");
    headerDiv.getElementsByClassName("right-category-holder")[0].appendChild(categoryDiv);
}

function removeRightCategory(headerDiv, categoryDiv){
    HTMLUtils.removeClass(categoryDiv, "floating");
    headerDiv.getElementsByClassName("right-category-holder")[0].removeChild(categoryDiv);
}

function createLeftCategoryHolder(){
    let holder = document.createElement("div");
    HTMLUtils.addClass(holder, "three");
    HTMLUtils.addClass(holder, "columns");
    HTMLUtils.addClass(holder, "left-category-holder");
    return holder;
}

function createRightCategoryHolder(){
    let holder = document.createElement("div");
    HTMLUtils.addClass(holder, "nine");
    HTMLUtils.addClass(holder, "columns");
    HTMLUtils.addClass(holder, "right-category-holder");
    return holder;
}

function updateDivCategory(categoryDiv, responseCategory){
    categoryDiv.id = responseCategory.id;
    let title = getCategoryTitle(categoryDiv.parentElement);
    let span = title.getElementsByClassName("category-title-span")[0];
    span.innerHTML = responseCategory.name;
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
    addRightCategory(headerDiv, newBlankDiv);
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
    addLeftCategory(headerDiv, newCategoryDiv);
    let blankCategoryDiv = createBlankCategoryDiv(header);
    addRightCategory(headerDiv, blankCategoryDiv);
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

function listResponseTypes(){
    for (let i in allResponses){
        let response = allResponses[i];
        for (let j in headers){
            let header = headers[j];
            console.log("value: " + response.getResponseValue(header))
            console.log("type value: " + response.getResponseType(header).getResponseValue());
        }
    }
}

function responsesToJSON(){
    let responses = [];
    for (let i in allResponses){
        let response = allResponses[i];
        let responseObject = {};
        for (let j in headers){
            let header = headers[j];
            responseObject[header] = response.getCategorizedValue(header);
        }
        responses[i] = responseObject;
    }
    let json = JSON.stringify(responses);
    return json;
}

function responsesToCSV(){
    let json = responsesToJSON();
    let csv = Papa.unparse(json);
    return csv;
}

function processJSON(json){
    let csv = Papa.unparse(json);
    processCSV(csv);
}

function saveJSON(){
    if (allResponses.length > 0){
        console.log("Saving json...");
        let json = responsesToJSON();
        let blob = new Blob([json], {type: "text/plain; charset=utf-8"});
        saveAs(blob, "output.json");
    }
}

function saveCSV(){
    if (allResponses.length >0){
        console.log("saving csv...");
        let csv = responsesToCSV();
        let blob = new Blob([csv], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "output.csv");
    }
}

function compressCategories(){
    let csv = responsesToCSV();
    processCSV(csv);
}

function loadExample(){
    processJSON(Examples.jsonExample1);
}

loadExample();

window.listResponseTypes = listResponseTypes;
window.responsesToJSON = responsesToJSON;
window.responsesToCSV = responsesToCSV;
window.saveCSV = saveCSV;
window.saveJSON = saveJSON;