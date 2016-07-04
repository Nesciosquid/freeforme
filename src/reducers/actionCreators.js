// headers
export const addHeader = (header) => ({
  type: 'ADD_HEADER',
  header,
});
export const removeHeader = (header) => ({
  type: 'REMOVE_HEADER',
  header,
});
export const renameHeader = (oldHeader, newHeader) => ({
  type: 'RENAME_HEADER',
  oldHeader,
  newHeader,
});

// responseCategories
export const addUniqueResponseToCategory = (header, uniqueResponse, categoryName) => ({
  type: 'ADD_UNIQUE_RESPONSE_TO_CATEGORY',
  header,
  uniqueResponse,
  categoryName,
});

export const renameCategory = (header, oldCategoryName, newCategoryName) => ({
  type: 'RENAME_CATEGORY',
  header,
  oldCategoryName,
  newCategoryName,
});

// responses
export const addResponse = (response) => ({
  type: 'ADD_RESPONSE',
  response,
});
export const removeResponse = (response) => ({
  type: 'REMOVE_RESPONSE',
  response,
});
export const changeResponse = (oldResponse, newResponse) => ({
  type: 'CHANGE_RESPONSE',
  oldResponse,
  newResponse,
});

// unique responses
export const incrementUniqueResponse = (header, uniqueResponse) => ({
  type: 'ADD_UNIQUE_RESPONSE',
  header,
  uniqueResponse,
});

export const decrementUniqueResponse = (header, uniqueResponse) => ({
  type: 'REMOVE_UNIQUE_RESPONSE',
  header,
  uniqueResponse,
});

// general

export const reset = () => ({
  type: 'RESET',
});
