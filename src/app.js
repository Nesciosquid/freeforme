const Papa = require('papaparse');
const HTMLUtils = require('./htmlUtils.js');
const SurveyResponse = require('./surveyResponse.js');
const ResponseType = require('./responseType.js');
const ResponseCategory = require('./responseCategory.js');
const categorySuffix = '-categorized';
const reducerTest = require('./reducers/index.js');

let allResponses = [];
let headers = [];
let responseTypes = {};
let responseCategories = {};

let data = [];

const FreeformeApp = require('./components/FreeformeApp.jsx');

const ReactDOM = require('react-dom');
const React = require('react');

function updateReact() {
  ReactDOM.render(
    React.createElement(FreeformeApp, { data: responseCategories }),
    document.getElementById('reactContainer')
  );
}

function clear() {
  allResponses = [];
  headers = [];
  responseTypes = {};
  responseCategories = {};
  data = [];
}

function renameDuplicateHeaders() {
  headers = data[0];
  headers.forEach((headerOne, indexOne) => {
    headers.forEach((headerTwo, indexTwo) => {
      if (headerOne === headerTwo && indexOne !== indexTwo) {
        headers[indexTwo] = headers[indexTwo] + indexTwo;
      }
    });
  });
}

function hideInstructions() {
  document.getElementById('instructions').style.display = 'none';
}

function createDivs() {
  updateReact();
}

function collateResponses() {
  headers.forEach(header => {
    responseTypes[header] = {};
    responseCategories[header] = {};
  });

  allResponses.forEach(response => {
    headers.forEach(header => {
      const split = header.split(categorySuffix);
      const responseValue = response.getResponseValue(header);
      let types = responseTypes[header];
      if (split.length === 1) {
        if (!types.hasOwnProperty(responseValue)) {
          types[responseValue] = new ResponseType(responseValue, header);
        }
        const responseType = types[responseValue];
        responseType.addResponse(response);
      } else { // this is a category header!
          // the type is based on the first half of the split, before the suffix
        const type = response.getResponseValue(split[0]);
        types = responseTypes[split[0]];
        // if the type doesn't exist, add it
        if (!types.hasOwnProperty(type)) {
          types[type] = new ResponseType(type, split[0]);
        }

        const responseType = types[type];
        const categories = responseCategories[split[0]];

        // the name of the category is what's written
        // in the category header column for the current response
        const categoryName = responseValue;

        // if the category doesn't exist, add it
        if (!categories.hasOwnProperty(categoryName)) {
          // console.log("Adding new category for: " + categoryName);
          let locked = false;
          if (categoryName === 'Uncategorized') locked = true;
          categories[categoryName] = new ResponseCategory(categoryName, split[0], false, locked);
        }

        const category = categories[categoryName];

        // set the response type to be the child of this category
        category.setChildResponseType(responseType);
      }
    });
  });

  allResponses.forEach(response => {
    headers.forEach(header => {
      const split = header.split(categorySuffix);
      if (split.length === 1) {
        const categories = responseCategories[header];
        if (!categories.hasOwnProperty('Uncategorized')) {
          categories.Uncategorized = new ResponseCategory('Uncategorized', header, false, true);
        }
        const uncat = categories.Uncategorized;
        const rType = response.getResponseType(header);
        if (rType.getParent() == null) {
          uncat.setChildResponseType(rType);
        }
      }
    });
  });
}

function createSurveyResponses() {
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    allResponses.push(new SurveyResponse(row, headers, categorySuffix));
  }
}

function responsesToJSON() {
  const responses = [];
  allResponses.forEach(response => {
    const responseObject = {};
    headers.forEach(header => {
      const split = header.split(categorySuffix);
      if (split.length === 1) {
        const category = header + categorySuffix;
        responseObject[header] = response.getResponseValue(header);
        responseObject[category] = response.getCategorizedValue(header);
      }
    });
    responses.push(responseObject);
  });
  const json = JSON.stringify(responses);
  return json;
}

function responsesToCSV() {
  const json = responsesToJSON();
  const csv = Papa.unparse(json);
  return csv;
}

function saveJSON() {
  if (allResponses.length > 0) {
    const json = responsesToJSON();
    const blob = new Blob([json], { type: 'text/plain; charset=utf-8' });
    saveAs(blob, 'output.json'); // TODO: Get this as a library
  }
}

function saveCSV() {
  if (allResponses.length > 0) {
    const csv = responsesToCSV();
    const blob = new Blob([csv], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'output.csv'); // TODO: Get this as a library
  }
}

function setupSaveButton() {
  const button = document.getElementById('save-button');
  button.addEventListener('click', saveCSV);
}

function processCSV(csv) {
  clear();
  hideInstructions();
  const processed = Papa.parse(csv);
  data = processed.data;
  renameDuplicateHeaders();
  createSurveyResponses();
  collateResponses();
  createDivs();
}

function setupDragAndDropLoad(selector) {
  HTMLUtils.setupDnDFileController(selector, (files) => {
    const f = files[0];

    const reader = new FileReader();
    reader.onloadend = function CSVLoaded() {
      processCSV(this.result);
    };
    try {
      reader.readAsText(f);
    } catch (err) {
      Error.log(`unable to load JSON: ${f}`);
    }
  });
}

setupDragAndDropLoad('#drop', processCSV);
setupSaveButton();

window.headers = (() => headers)();
window.allResponses = allResponses;
window.responseTypes = responseTypes;
window.updateReact = updateReact;
window.responsesToJSON = responsesToJSON;
window.responsesToCSV = responsesToCSV;
window.saveCSV = saveCSV;
window.saveJSON = saveJSON;
window.updateReact = updateReact;
