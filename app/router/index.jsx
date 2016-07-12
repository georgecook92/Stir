import React from 'react';
import {Route, Router, IndexRoute, hashHistory} from 'react-router';

import Login from 'Login';
import Register from 'Register';

// var requireLogin = (nextState, replace, next) => {
//   //do own check
//   if(!firebase.auth().currentUser) {
//     replace('/');
//   }
//   next();
// };
//
// var redirectIfLoggedIn = (nextState, replace, next) => {
//   //do own check
//   if(firebase.auth().currentUser) {
//     replace('/todos');
//   }
//   next();
// };


export default (
  <Router history={hashHistory}>
    <Route path="/" >
      <Route path="register" component={Register} />
      <IndexRoute component={Login} />
    </Route>
  </Router>
);
