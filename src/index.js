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
import ResetForgottenPassword from './components/auth/ResetForgottenPassword';
import createPosts from './components/posts/createPosts';
import viewPosts from './components/posts/viewPosts';
import viewPostDetail from './components/posts/viewPostDetail';

import Welcome from './components/welcome';
import RequireAuth from './components/auth/require_auth';

import {AUTH_USER, SAVE_USER} from './actions/types';



// checks if a user is logged in already
if (window.indexedDB) {
  var db = new Dexie('Stir');
  db.version(1).stores({
    posts: '_id, title, user_id, text, offline',
    users: 'user_id, email, firstName, lastName, token'
  });

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

        var path = window.location.pathname;

        //if path is either signin, signup or home - redirect because the user is already signed in
        if (path === '/signin' || path === '/signup' || path === '/') {
          browserHistory.push('/posts/view');
        }

      //  console.log(window.location.pathname);


      }
    })
    .catch( (err) => {
      //console.log(err);
    } );
} else if(localStorage.getItem('token')) {
//  console.log('local storage');
    store.dispatch( { type: AUTH_USER } );
    var userObj = {};
    userObj.email = localStorage.getItem('email');
    userObj.token = localStorage.getItem('token');
    userObj.user_id = localStorage.getItem('user_id');
    userObj.forename = localStorage.getItem('firstName');
    userObj.surname = localStorage.getItem('lastName');

    store.dispatch({
      type: SAVE_USER,
      payload: userObj
    });

    var path = window.location.pathname;

    //if path is either signin, signup or home - redirect because the user is already signed in
    if (path === '/signin' || path === '/signup' || path === '/') {
      browserHistory.push('/posts/view');
    }
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/' component={App}>
        <IndexRoute component={Welcome} />
        <Route path='login' component={Signin} />
        <Route path='register' component={Signup} />
        <Route path='posts/create' component={RequireAuth(createPosts)} />
        <Route path='posts/view' component={RequireAuth(viewPosts)} />
        <Route path='posts/view/:post_id' component={RequireAuth(viewPostDetail)} />
        <Route path='profile' component={RequireAuth(Profile)} />
        <Route path='reset' component={RequireAuth(ResetPassword)} />
        <Route path='forgottenPassword' component={ForgottenPassword} />
        <Route path='resetForgottenPassword/:token' component={ResetForgottenPassword} />
      </Route>

    </Router>

  </Provider>
  , document.querySelector('.container'));
