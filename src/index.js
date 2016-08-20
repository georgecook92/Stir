import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
var store = require('./store/configureStore').configure();
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
var Dexie = require('dexie');

import App from './components/app';
import Signin from './components/auth/signin';
import Signup from './components/auth/signup';
import ForgottenPassword from './components/auth/ForgottenPassword';
import Profile from './components/Profile';
import ResetPassword from './components/ResetPassword';
import createPosts from './components/posts/createPosts';
import viewPosts from './components/posts/viewPosts';
import viewPostDetail from './components/posts/viewPostDetail';

import Welcome from './components/welcome';
import RequireAuth from './components/auth/require_auth';

import {AUTH_USER, SAVE_USER} from './actions/types';




if (window.indexedDB) {
  console.log('IDB supported');
  var db = new Dexie('Stir');
  db.version(1).stores({
    posts: '_id, title, user_id, text, offline',
    users: 'user_id, email, firstName, lastName, token'
  });

  // Open the database
  // db.open().catch(function(error) {
  //   alert('Uh oh : ' + error);
  // });

  db.users
    .toArray()
    .then( (doc) => {
      if (doc[0].token) {
        store.dispatch( { type: AUTH_USER } );

        doc[0].forename = doc[0].firstName;
        doc[0].surname = doc[0].lastName;

        store.dispatch({
          type: SAVE_USER,
          payload: doc[0]
        });

        browserHistory.push('/posts/create');
      }
    })
    .catch( (err) => {
      console.log(err);
    } );
} else if(localStorage.getItem('token')) {
  console.log('local storage');
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/' component={App}>
        <IndexRoute component={Welcome} />
        <Route path='signin' component={Signin} />
        <Route path='signup' component={Signup} />
        <Route path='posts/create' component={RequireAuth(createPosts)} />
        <Route path='posts/view' component={RequireAuth(viewPosts)} />
        <Route path='posts/view/:post_id' component={RequireAuth(viewPostDetail)} />
        <Route path='profile' component={RequireAuth(Profile)} />
        <Route path='reset' component={RequireAuth(ResetPassword)} />
        <Route path='forgottenPassword' component={ForgottenPassword} />
      </Route>

    </Router>

  </Provider>
  , document.querySelector('.container'));
