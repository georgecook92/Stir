//EXPORT REDUCERS - LINK UP IN THE STORE

export var searchTextReducer = (state_search_text = '',action) => {
  switch (action.type) {
    case 'SET_SEARCH_TEXT':
      return action.searchText;

    default:
      return state_search_text;

  }
};
