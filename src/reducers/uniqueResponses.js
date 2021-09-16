import deepFreeze from 'deep-freeze';
import expect from 'expect';
import { getElementOrEmptyObject, pureAddObject, pureReplaceObject }
  from '../functionUtils.js';
import * as ActionCreators from './actionCreators.js';


const incrementUniqueResponse = (object, header, uniqueResponse) => {
  let headerGroup = getElementOrEmptyObject(object, header);

  if (headerGroup.hasOwnProperty(uniqueResponse)) {
    const count = headerGroup[uniqueResponse];
    headerGroup = pureReplaceObject(headerGroup, uniqueResponse, count + 1);
  } else {
    headerGroup = pureAddObject(headerGroup, uniqueResponse, 1);
  }
  return pureReplaceObject(object, header, headerGroup);
};

const decrementUniqueResponse = (object, header, uniqueResponse) => {
  let headerGroup = getElementOrEmptyObject(object, header);
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
export default uniqueResponses = (state = {}, action) => {
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
    ActionCreators.incrementUniqueResponse(header, uniqueResponse));
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
    ActionCreators.incrementUniqueResponse(header, uniqueResponse));
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
    ActionCreators.decrementUniqueResponse(header, uniqueResponse));
  const result2 = uniqueResponses(initState2,
    ActionCreators.decrementUniqueResponse(header, uniqueResponse));
  expect(result1).toEqual(endState1);
  expect(result2).toEqual(endState2);
};

testIncrement();
testIncrement2();
testDecrement();
