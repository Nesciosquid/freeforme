export const pureAddArray = (list = [], element) => [...list, element];
export const pureRemoveArrayByIndex = (list, elementIndex) => [
  ...list.slice(0, elementIndex),
  ...list.slice(elementIndex + 1),
];

export const pureRemoveArray = (list = [], element) => {
  const elementIndex = list.indexOf(element);
  if (elementIndex >= 0) {
    return pureRemoveArrayByIndex(list, elementIndex);
  }
  return list;
};

export const pureReplaceArrayByIndex = (list = [], elementIndex, newElement) => [
  ...list.slice(0, elementIndex),
  newElement,
  ...list.slice(elementIndex + 1),
];

export const pureReplaceArray = (list = [], element, newElement) => {
  const elementIndex = list.indexOf(element);
  if (elementIndex >= 0) {
    return pureReplaceArrayByIndex(list, elementIndex, newElement);
  }
  return list;
};

export const pureAddObject = (object, key, value) => {
  const temp = {};
  temp[key] = value;
  return Object.assign({}, object, temp);
};

export const pureRemoveObject = (object, key) => {
  const temp = {};
  temp[key] = undefined;
  return Object.assign({}, object, temp);
};

export const pureReplaceObject = (object, key, value) =>
  pureAddObject(object, key, value);

export const getElementOrEmptyObject = (object, header) => {
  if (object.hasOwnProperty(header)) { // header exists
    return object[header];
  } return {};
};

export const getElementOrEmptyArray = (object, header) => {
  if (object.hasOwnProperty(header)) { // header exists
    return object[header];
  } return [];
};
