import deepFreeze from 'deep-freeze';
import expect from 'expect';
import { pureAddArray, pureRemoveArray, pureReplaceArray }
  from '../functionUtils.js';
import * as ActionCreators from './actionCreators.js';

const addHeader = (list, header) => pureAddArray(list, header);
const removeHeader = (list, header) => pureRemoveArray(list, header);
const renameHeader = (list, oldHeader, newHeader) => {
  console.log(`replacing ${oldHeader} with ${newHeader}`);
  return pureReplaceArray(list, oldHeader, newHeader);
};


// reducer
const headers = (state = [], action) => {
  switch (action.type) {
    case 'ADD_HEADER':
      return addHeader(state, action.header);
    case 'REMOVE_HEADER':
      return removeHeader(state, action.header);
    case 'RENAME_HEADER':
      return renameHeader(state, action.oldHeader, action.newHeader);
    case 'RESET':
      return [];
    default:
      return state;
  }
};

// testing
const testAddHeader = () => {
  const initState = [];
  deepFreeze(initState);
  const endState = ['foo'];
  expect(headers(initState, ActionCreators.addHeader('foo'))).toEqual(endState);
};

const testRemoveHeader = () => {
  const initState = ['foo', 'bar'];
  deepFreeze(initState);
  const endState = ['bar'];
  expect(headers(initState, ActionCreators.removeHeader('foo'))).toEqual(endState);
};

const testRenameHeader = () => {
  const initState = ['foo', 'bar'];
  deepFreeze(initState);
  const endState = ['baz', 'bar'];
  expect(headers(initState, ActionCreators.renameHeader('foo', 'baz'))).toEqual(endState);
};

testAddHeader();
testRemoveHeader();
testRenameHeader();

module.exports = headers;
