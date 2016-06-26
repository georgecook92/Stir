var React = require('react');
var ReactDOM = require('react-dom');

var {Provider} = require('react-redux');
//destructuring syntax - same as - var Route = require('react-router').Route and so on
var {hashHistory} = require('react-router');

var store = require('configureStore').configure();

import router from 'app/router/';

//load foundation-sites - uses loaders also
$(document).foundation();

//app.css
require('style!css!sass!applicationStyles');

ReactDOM.render(
  //means that all of the app can access the redux store
  <Provider store={store}>
    {router}
  </Provider>,
  document.getElementById('app')
);
