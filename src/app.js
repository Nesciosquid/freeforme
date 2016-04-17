"use strict";


var Papa = require("papaparse");
var Dragula = require("dragula");
var HTMLUtils = require("./htmlUtils.js");
var SurveyResponse = require("./SurveyResponse.js");
var ResponseType = require("./responseType.js");
var ResponseCategory = require("./responseCategory.js");
var Examples = require("./examples.js");

var category_suffix = "-categorized";

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

window.renameCategoryByHeaderAndName = renameCategoryByHeaderAndName;

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
    //setupCompressButton();
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
    responseTypes = {};
    responseCategories = {};

    window.responseCategories = responseCategories;
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
    hideInstructions();
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
    HTMLUtils.addClass(categoryDiv, "subcategory");
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
    titleSpan.addEventListener("click", function(){changeToInput(this)});
    HTMLUtils.addClass(titleSpan, "category-title-span");
    titleSpan.innerHTML = responseCategory.name;
    titleDiv.appendChild(title);
    HTMLUtils.addClass(title, "category-title");
    HTMLUtils.addClass(titleDiv, "category-title-div");
    title.appendChild(titleSpan);
    addCountBadge(title, responseCategory.getResponseCount());
    return titleDiv;
}

function createHeaderDiv(header){
    let headerDiv = document.createElement("div")
    headerDiv.appendChild(createHeaderTitle(header));
    HTMLUtils.addClass(headerDiv, "category");
    headerDiv.appendChild(createCategoryRow());
    return headerDiv;
}

function createHeaderTitle(header){
    let title = document.createElement("h2");
    //title.innerHTML = "Column " + headers.indexOf(header) + ": " + header;
    title.innerHTML = header;
    HTMLUtils.addClass(title, "category-title");
    return title;
}

function createCategoryRow(){
    let row = document.createElement("div");
    HTMLUtils.addClass(row, "row");
    row.appendChild(createLeftCategoryHolder());
    row.appendChild(createRightCategoryHolder());
    return row;
}

function addLeftCategory(headerDiv, categoryDiv){
    headerDiv.getElementsByClassName("uncategorized-list")[0].appendChild(categoryDiv);
    HTMLUtils.addClass(categoryDiv, "locked-category");
}

function removeLeftCategory(headerDiv, categoryDiv){
    headerDiv.getElementsByClassName("uncategorized-list")[0].removeChild(categoryDiv);
    HTMLUtils.removeClass(categoryDiv, "locked-category");
}

function addRightCategory(headerDiv, categoryDiv){
    HTMLUtils.addClass(categoryDiv, "floating");
    headerDiv.getElementsByClassName("subcategory-holder")[0].appendChild(categoryDiv);
}

function removeRightCategory(headerDiv, categoryDiv){
    HTMLUtils.removeClass(categoryDiv, "floating");
    headerDiv.getElementsByClassName("subcategory-holder")[0].removeChild(categoryDiv);
}

function createLeftCategoryHolder(){
    let holder = document.createElement("div");
    HTMLUtils.addClass(holder, "three");
    HTMLUtils.addClass(holder, "columns");
    HTMLUtils.addClass(holder, "uncategorized-list");
    return holder;
}

function createRightCategoryHolder(){
    let holder = document.createElement("div");
    HTMLUtils.addClass(holder, "nine");
    HTMLUtils.addClass(holder, "columns");
    HTMLUtils.addClass(holder, "subcategory-holder");
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

// This 'New Category' gets tacked on to the ID, which means the ID has a space
// in it. :-\

function createBlankCategoryDiv(header){
    let blankCategory = new ResponseCategory("New", header, true);
    let blankCategoryDiv = createCategoryDiv(blankCategory);
    HTMLUtils.addClass(blankCategoryDiv, "blank-category");
    return blankCategoryDiv;
}

function initializeCategoryDiv(categoryDiv){
    let draggingDiv = getDraggingDiv(categoryDiv);
    let category = categoryIDsToObjects[draggingDiv.id];
    let categoryResponseTypes = category.getResponseTypes();
    for (let i in categoryResponseTypes){
        let type = categoryResponseTypes[i];
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

    if (source.getElementsByClassName("response-card").length == 0 && !HTMLUtils.hasClass(source.parentElement, "locked-category")){
        HTMLUtils.removeElement(source.parentElement);
    }
}

function setupCategories(header){
    let categories = responseCategories[header];
    for (let i in categories){
        if (i != "Uncategorized"){
            console.log("adding category for: " + i);
            let responseCategory = categories[i];
            let newCategoryDiv = createCategoryDiv(responseCategory);
            initializeCategoryDiv(newCategoryDiv);
            addRightCategory(headerDivs[header], newCategoryDiv);
            drakes[header].containers.push(getDraggingDiv(newCategoryDiv));
        }
    }
}

function setupHeader(header){
    let headerDiv = createHeaderDiv(header);
    let uncat = responseCategories[header]["Uncategorized"];
    
    let uncatDiv = createCategoryDiv(uncat);
    initializeCategoryDiv(uncatDiv);


    addLeftCategory(headerDiv, uncatDiv);

    let blankCategoryDiv = createBlankCategoryDiv(header);
    document.getElementById("lists").appendChild(headerDiv);
    headerDivs[header] = headerDiv;
    drakes[header] = Dragula([getDraggingDiv(uncatDiv), getDraggingDiv(blankCategoryDiv)]);
    drakes[header].on("drop", onDrop);

    setupCategories(header);
    addRightCategory(headerDiv, blankCategoryDiv);

}

function hideInstructions(){
    document.getElementById("instructions").style.display = 'none';
}

function createDivs(){
    for (let i in responseTypes){
        let split = i.split(category_suffix);
        if (split.length == 1){
            setupHeader(i);
        }
    }
}

function renameCategory(category, newName){
    if (newName == "" || newName == " "){
        newName = category.name;
    }
    delete responseCategories[category.header][category.name];
    responseCategories[category.header][newName] = category;
    category.name = newName;
    let element = document.getElementById(category.id);
    let parent = element.parentNode;
    let title = parent.children[0].children[0];
    let span = title.children[0];
    span.innerHTML = newName;
}

function changeToInput(title){
    let parent = title.parentNode;
    parent.removeChild(title);
    let inputBox = document.createElement("input");
    inputBox.addEventListener("keypress", function(event){
        if (event.keyCode == 13){
            renameAndChangeToTitle(this);
        }   
    });
    inputBox.addEventListener("focusout", function(event){
        renameAndChangeToTitle(this);
    });
    HTMLUtils.addClass(inputBox, "category-title-input-box");
    parent.insertBefore(inputBox, parent.children[0]);
    inputBox.focus();
}

function renameAndChangeToTitle(input){
    let parent = input.parentNode;
    let title = document.createElement("span");
    HTMLUtils.addClass(title, "category-title-span");
    title.innerHTML = input.value;
    parent.removeChild(parent.children[0]);
    title.addEventListener("click", function(event){
        changeToInput(this);
    });
    parent.insertBefore(title, parent.children[0]);
    let categoryDiv = parent.parentNode.parentNode.children[1];
    let category = categoryIDsToObjects[categoryDiv.id];
    renameCategory(category, title.innerHTML);
}

function renameCategoryByHeaderAndName(header, categoryName, newName){
    let category = responseCategories[header][categoryName];
    renameCategory(category, newName);
}

function collateResponses(){
    for (let i in headers){
        let header = headers[i];
        responseTypes[header] = {};
        responseCategories[header] = {};
    }

    for (let i in allResponses){
        let response = allResponses[i];
        for (let j in headers){
            let header = headers[j];
            let split = header.split(category_suffix);
            let responseValue = response.getResponseValue(header);
            let types = responseTypes[header];
            if (split.length == 1){
                if (!types.hasOwnProperty(responseValue)){
                    types[responseValue] = new ResponseType(responseValue, header);
                }
                let responseType = types[responseValue];
                responseType.addResponse(response);
            } else { // this is actually a category header

                // the type is based on the first half of the split, before the suffix
                let type = response.getResponseValue(split[0]);
                types = responseTypes[split[0]];
                // if the type doesn't exist, add it
                if (!types.hasOwnProperty(type)){
                    types[type] = new ResponseType(type, split[0]);
                } 

                let responseType = types[type];
                let categories = responseCategories[split[0]];
                
                // the name of the category is what's written in the category header column for the current response
                let categoryName = responseValue;

                // if the category doesn't exist, add it
                if (!categories.hasOwnProperty(categoryName)){
                    console.log("Adding new category for: " + categoryName);
                    categories[categoryName] = new ResponseCategory(categoryName, split[0], false);
                }

                let category = categories[categoryName];

                //set the response type to be the child of this category
                category.setChildResponseType(responseType);
            }   
        }
    }

    console.log(responseTypes);
    console.log(responseCategories);
}

function createSurveyResponses(){
   for (let i =1; i < data.length; i++){
        let row = data[i];
        allResponses.push(new SurveyResponse(row, headers, category_suffix));
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
            let split = header.split(category_suffix);
            if (split.length == 1){
                let category = header + category_suffix;
                responseObject[header] = response.getResponseValue(header);
                responseObject[category] = response.getCategorizedValue(header);
            }
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

//loadExample();

window.listResponseTypes = listResponseTypes;
window.responsesToJSON = responsesToJSON;
window.responsesToCSV = responsesToCSV;
window.saveCSV = saveCSV;
window.saveJSON = saveJSON;
