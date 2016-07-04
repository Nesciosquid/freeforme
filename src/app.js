const Papa = require('papaparse');
const HTMLUtils = require('./htmlUtils.js');
const SurveyResponse = require('./surveyResponse.js');
const categorySuffix = '-categorized';
const reducerTest = require('./reducers/index.js');
const ActionCreators = require('./reducers/actionCreators.js');
const FileSaver = require('file-saver');

let data = [];

const defaultCategory = 'Uncategorized';

const FreeformeApp = require('./components/FreeformeApp.jsx');

const ReactDOM = require('react-dom');
const React = require('react');
const Redux = require('redux');
import { Provider } from 'react-redux';

const store = Redux.createStore(reducerTest);

function updateReact() {
  ReactDOM.render(
    <Provider store={store}>
      <FreeformeApp />
    </Provider>,
    document.getElementById('reactRoot')
  );
}

function clear() {
  store.dispatch(ActionCreators.reset());
  data = [];
}

function addHeadersToStore(headerList) {
  headerList.forEach(header => {
    store.dispatch(ActionCreators.addHeader(header));
  });
}

function renameDuplicateHeaders() {
  const headerList = data[0];
  headerList.forEach((headerOne, indexOne) => {
    headerList.forEach((headerTwo, indexTwo) => {
      if (headerOne === headerTwo && indexOne !== indexTwo) {
        headerList[indexTwo] = headerList[indexTwo] + indexTwo;
      }
    });
  });
  addHeadersToStore(headerList);
  return headerList;
}

function hideInstructions() {
  document.getElementById('instructions').style.display = 'none';
}

function isCategoryHeader(header) {
  const split = header.split(categorySuffix);
  if (split.length === 1) {
    return false;
  }
  return true;
}

function getHeader(categoryHeader) {
  return categoryHeader.split(categorySuffix)[0];
}

function hasBeenCategorized(header, uniqueResponse) {
  const state = store.getState();
  const categories = state.responseCategories[header];
  let found = false;
  if (categories === undefined) return found;
  Object.keys(categories).forEach(categoryKey => {
    const category = categories[categoryKey];
    if (category.indexOf(uniqueResponse) >= 0) {
      found = true;
    }
  });
  return found;
}

function collateResponses() {
  const state = store.getState();
  const headers = state.headers;
  const responses = state.responses;

  responses.forEach(response => {
    headers.forEach(header => {
      if (!isCategoryHeader(header)) {
        const uniqueResponse = response.getResponseValue(header);
        store.dispatch(
          ActionCreators.incrementUniqueResponse(
            header, uniqueResponse));
        if (!hasBeenCategorized(header, uniqueResponse)) {
          store.dispatch(ActionCreators.addUniqueResponseToCategory(
            header,
            uniqueResponse,
            defaultCategory));
        }
      } else { // this is a category header
        const realHeader = getHeader(header);
        const categoryName = response.getResponseValue(header);
        const uniqueResponse = response.getResponseValue(getHeader(realHeader));
        store.dispatch(
          ActionCreators.addUniqueResponseToCategory(
            realHeader,
            uniqueResponse,
            categoryName));
      }
    });
  });
}

function createSurveyResponses() {
  const headers = store.getState().headers;
  data.slice(1).forEach(row => {
    const resp = new SurveyResponse(row, headers, categorySuffix);
    store.dispatch(ActionCreators.addResponse(resp));
  });
}

function getResponseCategory(header, uniqueResponse) {
  const state = store.getState();
  const categories = state.responseCategories[header];
  let cat;
  Object.keys(categories).forEach(categoryKey => {
    const category = categories[categoryKey];
    if (category.indexOf(uniqueResponse) >= 0) {
      cat = categoryKey;
    }
  });
  return cat;
}

function responsesToJSON() {
  const state = store.getState();
  const headers = state.headers;
  const responses = state.responses;
  const responseObjects = [];
  responses.forEach(response => {
    const responseObject = {};
    headers.forEach(header => {
      if (!isCategoryHeader(header)) {
        const category = header + categorySuffix;
        const value = response.getResponseValue(header);
        responseObject[header] = value;
        responseObject[category] = getResponseCategory(header, value);
      }
    });
    responseObjects.push(responseObject);
  });
  const json = JSON.stringify(responseObjects);
  return json;
}

function responsesToCSV() {
  const json = responsesToJSON();
  const csv = Papa.unparse(json);
  return csv;
}

function saveJSON() {
  const state = store.getState();
  const responses = state.responses;
  if (responses.length > 0) {
    const json = responsesToJSON();
    const blob = new Blob([json], { type: 'text/plain; charset=utf-8' });
    FileSaver.saveAs(blob, 'output.json'); // TODO: Get this as a library
  }
}

function saveCSV() {
  const state = store.getState();
  const responses = state.responses;
  if (responses.length > 0) {
    const csv = responsesToCSV();
    const blob = new Blob([csv], { type: 'text/plain;charset=utf-8' });
    FileSaver.saveAs(blob, 'output.csv'); // TODO: Get this as a library
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
  // createDivs();
  updateReact();
  store.subscribe(updateReact);
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

setupDragAndDropLoad('#instructions', processCSV);
setupSaveButton();

window.store = store;
window.responsesToJSON = responsesToJSON;
window.responsesToCSV = responsesToCSV;
window.saveCSV = saveCSV;
window.saveJSON = saveJSON;
window.updateReact = updateReact;
