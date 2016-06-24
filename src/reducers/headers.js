import deepFreeze from 'deep-freeze';
import expect from 'expect';
import { pureAddArray, pureRemoveArray, pureReplaceArray }
  from '../pureFunctions.js';

const addHeader = (list, header) => pureAddArray(list, header);
const removeHeader = (list, header) => pureRemoveArray(list, header);
const renameHeader = (list, oldHeader, newHeader) =>
  pureReplaceArray(list, oldHeader, newHeader);

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

// action creators
const addHeaderAction = (header) => ({
  type: 'ADD_HEADER',
  header,
});
const removeHeaderAction = (header) => ({
  type: 'REMOVE_HEADER',
  header,
});
const renameHeaderAction = (oldHeader, newHeader) => ({
  type: 'RENAME_HEADER',
  oldHeader,
  newHeader,
});

// testing
const testAddHeader = () => {
  const initState = [];
  deepFreeze(initState);
  const endState = ['foo'];
  expect(headers(initState, addHeaderAction('foo'))).toEqual(endState);
};

const testRemoveHeader = () => {
  const initState = ['foo', 'bar'];
  deepFreeze(initState);
  const endState = ['bar'];
  expect(headers(initState, removeHeaderAction('foo'))).toEqual(endState);
};

const testRenameHeader = () => {
  const initState = ['foo', 'bar'];
  deepFreeze(initState);
  const endState = ['baz', 'bar'];
  expect(headers(initState, renameHeaderAction('foo', 'baz'))).toEqual(endState);
};

testAddHeader();
testRemoveHeader();
testRenameHeader();

module.exports = headers;
