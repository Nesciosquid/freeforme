export const getCategories = (store, header) => (
  store.getState().responseCategories[header]
);

export const getUniques = (store, header) => (
  store.getState().uniqueResponses[header]
);

export const getCategory = (store, header, categoryName) => (
  getCategories(store, header)[categoryName]
);

export const getResponseCount = (store, header, categoryName) => {
  const uniques = getUniques(store, header);
  const category = getCategory(store, header, categoryName);
  let sum = 0;
  category.forEach((uniqueKey) => {
    sum += uniques[uniqueKey];
  });
  return sum;
};

export const getUniquesInCategory = (store, header, categoryName) => {
  const uniques = getUniques(store, header);
  const category = getCategory(store, header, categoryName);
  const temp = {};
  category.forEach((uniqueKey) => {
    temp[uniqueKey] = uniques[uniqueKey];
  });
  return temp;
};
