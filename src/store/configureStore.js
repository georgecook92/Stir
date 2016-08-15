import * as redux from 'redux';
import {reducer as formReducer} from 'redux-form';
import authReducer from '../reducers/auth_reducer';
import postsReducer from '../reducers/posts_reducer';
import searchTextReducer from '../reducers/search_text_reducer';
import loadingReducer from '../reducers/loading_reducer';
import thunk from 'redux-thunk';
import reduxPromise from 'redux-promise';

export var configure = (initialState = {}) => {
  var reducer = redux.combineReducers({
    form: formReducer,
    auth: authReducer,
    posts: postsReducer,
    searchText: searchTextReducer,
    loading: loadingReducer
  });

  var store = redux.createStore(reducer, initialState, redux.compose(
    redux.applyMiddleware(thunk, reduxPromise),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ));

  return store;

};
