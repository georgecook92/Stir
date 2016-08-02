import {GET_POSTS, GET_POST, TOGGLE_OFFLINE, REMOVE_SELECTED_RECIPE} from '../actions/types';

export default function(state = [],action) {
  switch (action.type) {

    case GET_POSTS:

      return {
        ...state,
        all: action.payload
      }

    case GET_POST:
      return {
        ...state,
        selected: action.payload[0]
      }

    case REMOVE_SELECTED_RECIPE:
    console.log('state from reducer', state);
      return {
        ...state,
        selected: {}
      }


    default:
        return state;
  }
}
