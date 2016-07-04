import { combineReducers } from 'redux';
import headers from './headers.js';
import responses from './responses.js';
import responseCategories from './responseCategories.js';
import uniqueResponses from './uniqueResponses.js';

const freeformeData = combineReducers({
  headers,
  uniqueResponses,
  responses,
  responseCategories,
});

module.exports = freeformeData;
