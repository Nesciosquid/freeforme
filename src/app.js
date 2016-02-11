"use strict";

var Papa = require("papaparse");
var Dragula = require("dragula");
var HTMLUtils = require("./htmlUtils.js");
var SurveyResponse = require("./SurveyResponse.js");
var ResponseType = require("./responseType.js");

var allResponses = [];
var headers = [];
var responseTypes = {};
var responseCategories = {};
var data = [];

var drake = Dragula();

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
}

function processCSV(csv){
    clear();
    let processed = Papa.parse(csv);
    data = processed.data;
    headers = data[0];
    createSurveyResponses();
    collateResponses();
    createDivs();
}

function addCountBadge(element, count){
    var badge = document.createElement("span");
    badge.innerHTML = count;
    HTMLUtils.addClass(badge, "count-badge");
    element.appendChild(badge);
}

function createDivs(){
    var lists = document.getElementById("lists");
    while (lists.firstChild) {
        lists.removeChild(lists.firstChild);
    }
    for (let i in responseTypes){
        let headerTypes = responseTypes[i];
        let headerTitle = document.createElement("span");
        headerTitle.innerHTML = "<h2>"+i+"</h2>";
        HTMLUtils.addClass(headerTitle, "header-title");
        let headerDiv = document.createElement("div");
        headerDiv.appendChild(headerTitle);
        let headerList = document.createElement("div");
        headerList.setAttribute("id", i+"_list");
        HTMLUtils.addClass(headerList, "card-list");
        headerDiv.appendChild(headerList);
        //headerList.appendChild(headerTitle);
        lists.appendChild(headerDiv);
        drake.containers.push(headerList);
        for (let j in headerTypes){
            console.log("adding entry for : " + j);
            let type = headerTypes[j];
            let currentType = document.createElement("div");
            HTMLUtils.addClass(currentType, "response-card");
            currentType.setAttribute("id", type.id)
            let typeString = document.createElement("span");
            typeString.innerHTML = type.responseString;
            currentType.appendChild(typeString);
            addCountBadge(currentType, type.getResponseCount());
            headerList.appendChild(currentType);
        }
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