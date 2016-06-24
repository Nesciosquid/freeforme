import deepFreeze from 'deep-freeze';
import expect from 'expect';
import { pureAddObject, pureRemoveObject, pureReplaceObject }
  from '../pureFunctions.js';

const incrementUniqueResponse = (object, header, uniqueResponse) => {
  let headerGroup;
  if (object.hasOwnProperty(header)) { // header exists
    headerGroup = object[header];
  } else {
    headerGroup = {};
  }
  if (headerGroup.hasOwnProperty(uniqueResponse)) {
    const count = headerGroup[uniqueResponse];
    headerGroup = pureReplaceObject(headerGroup, uniqueResponse, count + 1);
  } else {
    headerGroup = pureAddObject(headerGroup, uniqueResponse, 1);
  }
  return pureReplaceObject(object, header, headerGroup);
};

const decrementUniqueResponse = (object, header, uniqueResponse) => {
  let headerGroup;
  if (object.hasOwnProperty(header)) { // header exists
    headerGroup = object[header];
  } else {
    headerGroup = {};
  }
  if (headerGroup.hasOwnProperty(uniqueResponse)) {
    const count = headerGroup[uniqueResponse];
    if (count > 1) {
      headerGroup = pureReplaceObject(headerGroup, uniqueResponse, (count - 1));
    } else {
      headerGroup = pureReplaceObject(headerGroup, uniqueResponse, 0);
    }
  }
  return pureReplaceObject(object, header, headerGroup);
};

// reducer
const uniqueResponses = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_UNIQUE_RESPONSE':
      return incrementUniqueResponse(state, action.header, action.uniqueResponse);
    case 'REMOVE_UNIQUE_RESPONSE':
      return decrementUniqueResponse(state, action.header, action.uniqueResponse);
    case 'RESET':
      return {};
    default:
      return state;
  }
};

// action creators
const incrementUniqueResponseAction = (header, uniqueResponse) => ({
  type: 'ADD_UNIQUE_RESPONSE',
  header,
  uniqueResponse,
});
const decrementUniqueResponseAction = (header, uniqueResponse) => ({
  type: 'REMOVE_UNIQUE_RESPONSE',
  header,
  uniqueResponse,
});

// testing
const testIncrement = () => {
  const initState = {};
  const uniqueResponse = 'foo';
  const header = 'bar';
  deepFreeze(initState);
  deepFreeze(uniqueResponse);
  const endState = {};
  endState[header] = {};
  endState[header][uniqueResponse] = 1;
  const result = uniqueResponses(initState,
    incrementUniqueResponseAction(header, uniqueResponse));
  expect(result).toEqual(endState);
};

const testIncrement2 = () => {
  const initState = {
    bar: {
      foo: 4,
    },
  };
  const uniqueResponse = 'foo';
  const header = 'bar';
  deepFreeze(initState);
  deepFreeze(uniqueResponse);
  const endState = {};
  endState[header] = {};
  endState[header][uniqueResponse] = 5;
  const result = uniqueResponses(initState,
    incrementUniqueResponseAction(header, uniqueResponse));
  expect(result).toEqual(endState);
};

const testDecrement = () => {
  const initState1 = {
    bar: {
      foo: 2,
    },
  };
  const initState2 = {
    bar: {
      foo: 1,
    },
  };
  const uniqueResponse = 'foo';
  const header = 'bar';
  deepFreeze(initState1);
  deepFreeze(initState2);
  deepFreeze(uniqueResponse);
  const endState1 = {};
  const endState2 = {};
  endState1[header] = {};
  endState1[header][uniqueResponse] = 1;
  endState2[header] = {};
  endState2[header][uniqueResponse] = 0;
  const result1 = uniqueResponses(initState1,
    decrementUniqueResponseAction(header, uniqueResponse));
  const result2 = uniqueResponses(initState2,
    decrementUniqueResponseAction(header, uniqueResponse));
  expect(result1).toEqual(endState1);
  expect(result2).toEqual(endState2);
};

testIncrement();
testIncrement2();
testDecrement();

module.exports = uniqueResponses;
