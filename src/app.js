"use strict";

var Papa = require("papaparse");
var HTMLUtils = require("./htmlUtils.js");

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

function processCSV(csv){
    let processed = Papa.parse(csv);
    var counters = {};
    var data = processed.data;
    var headers = data[0];

    console.log("Headers");
    console.log(headers);

    for (var header in headers){
        counters[headers[header]] = {};
    }

    console.log("Data");
    console.log(data);
    console.log("Counters");
    console.log(counters);

    for (var i = 1; i < data.length; i++){
        let row = data[i];
        for (var j=0; j < row.length; j++){
            let header = headers[j];
            let value = row[j];
            if (!counters[header].hasOwnProperty(value)){
                counters[header][value] = 0;
            } 
            counters[header][value] = counters[header][value] + 1;
        }
    }

    console.log(counters)
}