import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
var store = require('./store/configureStore').configure();
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
var Dexie = require('dexie');

import App from './components/app';
import Signin from './components/auth/signin';
import Signout from './components/auth/signout';
import Signup from './components/auth/signup';
import createPosts from './components/posts/createPosts';
import viewPosts from './components/posts/viewPosts';
import viewPostDetail from './components/posts/viewPostDetail';

import Welcome from './components/welcome';
import RequireAuth from './components/auth/require_auth';

import {AUTH_USER, SAVE_USER} from './actions/types';

const token = localStorage.getItem('token');

var db = new Dexie('Users');
db.version(1).stores({
  users: 'user_id, email, firstName, lastName, token'
});

// Open the database
db.open().catch(function(error) {
  alert('Uh oh : ' + error);
});

//push to posts page if logged in and handle some redux state
db.users
  .toArray()
  .then( (doc) => {
    //if indexedDB has a token or localStorage has a token
    if (doc[0].token || localStorage.getItem('token')) {
      //we need to update app state
      store.dispatch( { type: AUTH_USER } );

      doc[0].forename = doc[0].firstName;
      doc[0].surname = doc[0].lastName;

      store.dispatch({
        type: SAVE_USER,
        payload: doc[0]
      });

      browserHistory.push('/posts/create');

    }
  } )
  .catch( (err) => {
    console.log(err);
  } );

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/' component={App}>
        <IndexRoute component={Welcome} />
        <Route path='signin' component={Signin} />
        <Route path='signout' component={Signout} />
        <Route path='signup' component={Signup} />
        <Route path='posts/create' component={RequireAuth(createPosts)} />
        <Route path='posts/view' component={RequireAuth(viewPosts)} />
        <Route path='posts/view/:post_id' component={RequireAuth(viewPostDetail)} />
      </Route>

    </Router>

  </Provider>
  , document.querySelector('.container'));
