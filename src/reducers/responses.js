import deepFreeze from 'deep-freeze';
import expect from 'expect';
import { pureAddArray, pureRemoveArray, pureReplaceArray }
  from '../functionUtils.js';
import SurveyResponse from '../surveyResponse.js';
import * as ActionCreators from './actionCreators.js';

const addResponse = (list, response) => pureAddArray(list, response);
const removeResponse = (list, response) => pureRemoveArray(list, response);
const changeResponse = (list, oldResponse, newResponse) =>
  pureReplaceArray(list, oldResponse, newResponse);

// reducer
export default responses = (state = [], action) => {
  switch (action.type) {
    case 'ADD_RESPONSE':
      return addResponse(state, action.response);
    case 'REMOVE_RESPONSE':
      return removeResponse(state, action.response);
    case 'CHANGE_RESPONSE':
      return changeResponse(state, action.oldResponse, action.newResponse);
    case 'RESET':
      return [];
    default:
      return state;
  }
};

// testing
const testAddResponse = () => {
  const initState = [];
  const response = new SurveyResponse([0, 1], ['foo', 'bar']);
  deepFreeze(initState);
  deepFreeze(response);
  const endState = [response];
  expect(responses(
    initState, ActionCreators.addResponse(response))).toEqual(endState);
};

const testRemoveResponse = () => {
  const responseA = new SurveyResponse(['yes', 'no'], ['foo', 'bar']);
  const responseB = new SurveyResponse(['yo', 'tally'], ['foo', 'bar']);
  const initState = [responseA, responseB];
  deepFreeze(initState);
  deepFreeze(responseA);
  deepFreeze(responseB);
  const endState = [responseB];
  expect(responses(
    initState, ActionCreators.removeResponse(responseA))).toEqual(endState);
};

const testChangeResponse = () => {
  const responseA = new SurveyResponse(['yes', 'no'], ['foo', 'bar']);
  const responseB = new SurveyResponse(['yo', 'tally'], ['foo', 'bar']);
  const initState = [responseA];
  deepFreeze(initState);
  deepFreeze(responseA);
  deepFreeze(responseB);
  const endState = [responseB];
  expect(responses(
    initState, ActionCreators.changeResponse(responseA, responseB))).toEqual(endState);
};

testAddResponse();
testRemoveResponse();
testChangeResponse();
