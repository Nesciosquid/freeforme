import deepFreeze from 'deep-freeze';
import expect from 'expect';
import { getElementOrEmptyObject, getElementOrEmptyArray, pureAddObject,
  pureRemoveObject, pureReplaceObject, pureRemoveArray, pureAddArray }
  from '../functionUtils.js';
import * as ActionCreators from './actionCreators.js';

const addResponseToCategory = (object, header, response, categoryName) => {
  // get the header group for the given header key, or an empty object
  let headerGroup = getElementOrEmptyObject(object, header);
  const scrubbedCategories = {};
  // remove the target response from any other categories -- should only be one!
  Object.keys(headerGroup).forEach((categoryKey) => {
    scrubbedCategories[categoryKey] =
    pureRemoveArray(headerGroup[categoryKey], response);
  });

  // swap the scrubbed categories with the old header group
  headerGroup = scrubbedCategories;

  // get the old category, add the response to it
  const updatedCategory = pureAddArray(
    getElementOrEmptyArray(headerGroup, categoryName), response);

  // replace the category in the header with the updated one
  headerGroup = pureReplaceObject(headerGroup, categoryName, updatedCategory);

  // return the modified state with the header group updated
  return pureReplaceObject(object, header, headerGroup);
};

const renameCategory = (object, header, oldCategoryName, newCategoryName) => {
  // get the header group for the given header key, or an empty object
  let headerGroup = getElementOrEmptyObject(object, header);

  // get the old category to be renamed
  const oldCategory = getElementOrEmptyArray(headerGroup, oldCategoryName);

  // add a new category to the header with the new key
  headerGroup = pureAddObject(pureRemoveObject(headerGroup, oldCategoryName),
     newCategoryName, oldCategory);

   // return the modified state with the header group updated
  return pureReplaceObject(object, header, headerGroup);
};

// reducer
const responseCategories = (state = {}, action) => {
  switch (action.type) {
    case 'RENAME_CATEGORY':
      return renameCategory(
        state, action.header,
        action.oldCategoryName,
        action.newCategoryName
      );
    case 'ADD_UNIQUE_RESPONSE_TO_CATEGORY':
      return addResponseToCategory(
        state, action.header, action.uniqueResponse, action.categoryName
      );
    default:
      return state;
  }
};

const testAddResp = () => {
  const initState = { header: { cat: ['bar'] } };
  const uniqueResponse = 'baz';
  const header = 'header';
  const category = 'cat';
  deepFreeze(initState);
  const endState = {};
  endState[header] = {};
  endState[header][category] = ['bar', 'baz'];
  const result = responseCategories(initState,
    ActionCreators.addUniqueResponseToCategory(header, uniqueResponse, category));
  expect(result).toEqual(endState);
};

const testAddResp2 = () => {
  const initState = { header: {} };
  const uniqueResponse = 'baz';
  const header = 'header';
  const category = 'cat';
  deepFreeze(initState);
  const endState = {};
  endState[header] = {};
  endState[header][category] = ['baz'];
  const result = responseCategories(initState,
    ActionCreators.addUniqueResponseToCategory(header, uniqueResponse, category));
  expect(result).toEqual(endState);
};

const testAddResp3 = () => {
  const initState = { header: {
    otherCat: ['bar', 'baz'],
  } };
  const uniqueResponse = 'baz';
  const header = 'header';
  const category = 'cat';
  const otherCategory = 'otherCat';
  deepFreeze(initState);
  const endState = {};
  endState[header] = {};
  endState[header][category] = ['baz'];
  endState[header][otherCategory] = ['bar'];
  const result = responseCategories(initState,
    ActionCreators.addUniqueResponseToCategory(header, uniqueResponse, category));
  expect(result).toEqual(endState);
};

const testAddResp4 = () => {
  const initState = {
    header: {},
    otherHeader: {
      bar: ['baz'],
    },
  };
  const uniqueResponse = 'baz';
  const otherHeader = 'otherHeader';
  const header = 'header';
  const category = 'cat';
  const otherCategory = 'bar';
  deepFreeze(initState);
  const endState = {};
  endState[header] = {};
  endState[header][category] = ['baz'];
  endState[otherHeader] = {};
  endState[otherHeader][otherCategory] = ['baz'];
  const result = responseCategories(initState,
    ActionCreators.addUniqueResponseToCategory(header, uniqueResponse, category));
  expect(result).toEqual(endState);
};

const testRenameCat = () => {
  const initState = {
    header: {
      cat: ['baz', 'fluff', 'foobar'],
    },
  };
  const header = 'header';
  const category = 'cat';
  const otherCategory = 'quark';
  deepFreeze(initState);
  const endState = {};
  endState[header] = {};
  endState[header][category] = undefined;
  endState[header][otherCategory] = ['baz', 'fluff', 'foobar'];
  const result = responseCategories(initState,
    ActionCreators.renameCategory(header, category, otherCategory));
  expect(result).toEqual(endState);
};

testAddResp();
testAddResp2();
testAddResp3();
testAddResp4();
testRenameCat();

module.exports = responseCategories;
