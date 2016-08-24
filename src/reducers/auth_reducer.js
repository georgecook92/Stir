import {AUTH_USER,UNAUTH_USER, AUTH_ERROR, FETCH_MESSAGE, SAVE_USER, GET_POSTS, REMOVE_AUTH_ERROR, UI_MESSAGE, REMOVE_UI_MESSAGE} from '../actions/types';

//AUTH REDUCER

export default function(state = {},action) {
  switch (action.type) {
    case AUTH_USER:
      return { ...state, error: '', authenticated: true };

    case UNAUTH_USER:
      return { ...state, authenticated: false };

    case AUTH_ERROR:
      return { ...state, error: action.payload };

    case UI_MESSAGE:
      return { ...state, message: action.payload };

    case REMOVE_AUTH_ERROR:
      return {...state, error: action.payload};

    case REMOVE_UI_MESSAGE:
      return { ...state, message: action.payload };

    case FETCH_MESSAGE:
      console.log(action.payload);
      return { ...state, message: action.payload.data.message };

    case SAVE_USER:
      return { ...state,
        email: action.payload.email,
        user_id: action.payload.user_id,
        forename: action.payload.forename,
        surname: action.payload.surname,
        token: action.payload.token
      }

    default:
      return state;
  }
}
