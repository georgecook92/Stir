import {SET_SEARCH_TEXT} from '../actions/types';

export default function(state = '',action) {
  switch (action.type) {
    case SET_SEARCH_TEXT:
      return action.searchText;

    default:
      return state;

  }
}
