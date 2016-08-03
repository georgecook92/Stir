import axios from 'axios';
axios.defaults.headers.common['authorisation'] = localStorage.getItem('token');
import {browserHistory} from 'react-router';
import {AUTH_USER, AUTH_ERROR, UNAUTH_USER, FETCH_MESSAGE, SAVE_USER, GET_POSTS, GET_POST, SET_SEARCH_TEXT, REMOVE_AUTH_ERROR, TOGGLE_OFFLINE, REMOVE_SELECTED_RECIPE} from './types';
var Dexie = require('dexie');

const ROOT_URL = 'https://stirapi.herokuapp.com';

var sendNotification = function(message) {
  var headers = {
    "Content-Type": "application/json",
    "Authorization": "Basic ZGE1YTJmOWItOTk3My00Y2IzLWI3YzEtODQzMDJiZGZhN2Nh"
  };

  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
  };

  var https = require('https');
  var req = https.request(options, function(res) {
    res.on('data', function(data) {
      console.log("Response:");
      console.log(JSON.parse(data));
    });
  });

  req.on('error', function(e) {
    console.log("ERROR:");
    console.log(e);
  });

  req.write(JSON.stringify(data));
  req.end();
};



export var toggleOffline = (post_id,offlineStatus) => {
  return function(dispatch) {
    axios.put(`${ROOT_URL}/changeOfflineStatus`, {post_id,offlineStatus})
      .then( (response) => {
        console.log('response from toggleOffline action ', response);
        var db = new Dexie('Posts');
        db.version(1).stores({
          posts: '_id, title, user_id, text, offline'
        });
        if (!offlineStatus) {
          db.open().then( function() {
          return db.posts
            .where("_id")
            .equals(post_id)
            .delete();
          } ).then( function(doc) {
            console.log('doc',doc);
          } );
        } else {
          response.data.forEach( (post) => {
            if (post.offline) {
              db.posts.add({
                _id: post._id,
                title: post.title,
                user_id: post.user_id,
                text: post.text,
                offline: post.offline
              });
            }
          } );
        }

        dispatch( {type: GET_POSTS, payload: response.data} );
      })
      .catch( (err) => {
        console.log('error from send posts action', err);
        if (err.response.status === 503) {
          dispatch(authError('No internet connection :( '));
        } else {
          dispatch(authError(err.response.data.error));
        }
      });
  }
}

export var setSearchText = (searchText) => {
  return {
    type: 'SET_SEARCH_TEXT',
    searchText
  }
};

//pass in object which contains the below properties
export function signinUser({email,password}) {
  return function(dispatch) {

    //submit email/password to server
    //{email,password} es6 shortcut
    axios.post(`${ROOT_URL}/signin`, { email,password })
      .then( response => {
        console.log('data from request: ' , response.data);
        //if request is good,
        //--we need to update state to indicate user is auth'd
        dispatch({type: AUTH_USER});
        dispatch({
          type: SAVE_USER,
          payload: response.data
        });

        var db = new Dexie('Users');
        db.version(1).stores({
      		users: 'user_id, email, firstName, lastName, token'
      	});

        // Open the database
      	db.open().catch(function(error) {
      		alert('Uh oh : ' + error);
      	});

        // or make a new one
      	db.users.add({
      		user_id: response.data.user_id,
      		email: response.data.email,
          firstName: response.data.forename,
          lastName: response.data.surname,
          token: response.data.token
      	});

        //--save JWT token
        localStorage.setItem('token', response.data.token);

        //--redirect to '/posts'

        browserHistory.push('/posts/create');


      } )
      .catch( (err) => {
        //if request is bad
        //--show error to user
        console.log('error from sign in', err);
        if (err.response.status === 503) {
          dispatch(authError('No internet connection :('));
        } else {
          dispatch(authError('Incorrect Login Information'));
        }
          console.log(err.response.status);

      } );
  }
}

export function signupUser({email,password,firstName,lastName}) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/signup`, { email,password,firstName,lastName })
      .then( response => {
        dispatch({type:AUTH_USER});
        dispatch({type: SAVE_USER, payload: response.data});
        console.log(response.data);

        var db = new Dexie('Users');

        // Define a schema
      	db.version(1).stores({
      		users: 'user_id, email, firstName, lastName, token'
      	});

        // Open the database
      	db.open().catch(function(error) {
      		alert('Uh oh : ' + error);
      	});

        // or make a new one
      	db.users.add({
      		user_id: response.data.user_id,
      		email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          token: response.data.token
      	});

        localStorage.setItem('token', response.data.token);

        browserHistory.push('/posts/create');
      })
      .catch( err => {
        console.log('error from sign up', err);
        if (err.response.status === 503) {
          dispatch(authError('No internet connection :('));
        } else {
          dispatch(authError(err.response.data.error));
        }

      });
  }
}

export function getUserPosts(user_id, token){
  return function(dispatch) {

    var db = new Dexie('Posts');
    db.version(1).stores({
      posts: '_id, title, user_id, text, offline'
    });

    // Open the database
    db.open().catch(function(error) {
      alert('Uh oh : ' + error);
    });

    axios.get(`${ROOT_URL}/getPosts?user_id=${user_id}`, {
      headers: {authorisation: token}
    }).then( (response) => {
      console.log('response from getPosts action ', response);
      dispatch( {type: GET_POSTS, payload: response.data} );

      response.data.forEach( (post) => {

        if (post.offline) {
          db.posts.add({
            _id: post._id,
            title: post.title,
            user_id: post.user_id,
            text: post.text,
            offline: post.offline
          });
        }
      } );

    })
      .catch( (err) => {
        console.log('error from get posts action', err);
        if (err.response.status === 503) {
          dispatch(authError('No internet connection :(. Check out your offline posts page. '));
        } else {
          dispatch(authError(err.response.data.error));
        }
      });
  }

}

export function deletePost(post_id) {
  return function(dispatch) {
    console.log('post id',post_id);
    axios.post(`${ROOT_URL}/deletePost`, {post_id: post_id} , {
      headers: {
        authorisation: localStorage.getItem('token')
      }
    })
    .then( (response) => {
      console.log('response from delete post action',response);

      var db = new Dexie('Posts');
      db.version(1).stores({
        posts: '_id, title, user_id, text, offline'
      });

      db.open().then( function() {
      return db.posts
        .where("_id")
        .equals(post_id)
        .delete();
      } ).then( function(doc) {
        console.log('doc',doc);
      } );

      browserHistory.push('/posts/view');
    })
    .catch( (err) => {
      console.log('error from delete posts action', err);
      if (err.response.status === 503) {
        dispatch(authError('No internet connection :( '));
      } else {
        dispatch(authError(err.response.data.error));
      }
    });
  }
}

export function sendPost({title,text}) {
  return function(dispatch) {

    var db = new Dexie('Users');
    db.version(1).stores({
      users: 'user_id, email, firstName, lastName, token'
    });

    // Open the database
    db.open().catch(function(error) {
      alert('Uh oh : ' + error);
    });

    db.users.toArray()
      .then( (doc) => {
        console.log('action doc', doc);
        //MIGHT NEED TO ERROR HANDLE LACK OF USER_ID in IDB
        return axios.post(`${ROOT_URL}/sendPost`, {
          title,
          user_id: doc[0].user_id,
          text,
          offline: false
          },
          {
            headers: {
              authorisation: localStorage.getItem('token')
            }
          } )
          .then( response => {
            console.log('response',response);
            // var message = {
            //   app_id: '04954d84-8b33-4124-98cb-ac53f5abcf1d',
            //   contents: {"en": "Recipe has been created"},
            //   include_player_ids: ['f30be904-34c2-4d5d-8cc0-942806715c98']
            // };
            //
            // sendNotification(message);

            browserHistory.push('/posts/view');
          })
          .catch( err => {
            console.log('error from send posts action', err);
            if (err.response.status === 503) {
              dispatch(authError('You\'re Offline! Your recipe will be sent in the background once you come back online!'));

              if ('serviceWorker' in navigator && 'SyncManager' in window) {
                navigator.serviceWorker.ready.then(function(reg) {
                  return reg.sync.register('send_post');
                }).catch(function() {
                  // system was unable to register for a sync,
                  // this could be an OS-level restriction
                  dispatch(removeAuthError());
                  dispatch(authError('You\'re Offline! But syncing in the background is not available.!'));
                });
              } else {
                // serviceworker/sync not supported
                dispatch(removeAuthError());
                dispatch(authError('You\'re Offline! But syncing in the background is not available.!'));
              }

            } else {
              dispatch(authError(err.response.data.error));
            }
          });
      } );
  }
}

export function getIndividualPost(post_id, token){

  return function(dispatch) {
    axios.get(`${ROOT_URL}/viewPost/${post_id}`, {
      headers: {authorisation: token}
    }).then( (response) => {
      console.log("resposne from indiv post", response);
      dispatch( {type: GET_POST, payload: response.data} )
    } );
  }
}



export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  }
}

export function removeAuthError(error) {
  return {
    type: REMOVE_AUTH_ERROR,
    payload: ''
  }
}

export function signoutUser(user_id) {
  return function(dispatch) {
    localStorage.removeItem('token');

    var db = new Dexie('Users');
    db.version(1).stores({
      users: 'user_id, email, firstName, lastName, token'
    });

    db.open().then( function() {
    return db.users
      .where("user_id")
      .equals(user_id)
      .delete();
    } ).then( function(doc) {
      console.log('doc',doc);
    } );

    dispatch({type: UNAUTH_USER});
  }
}

export function fetchMessage() {
  return function(dispatch) {
    axios.get(ROOT_URL, {
      headers: {authorisation: localStorage.getItem('token')}
    })
      .then( response => {
        console.log(response.data.message);
        dispatch({
          type: FETCH_MESSAGE,
          payload: response.data.message
        });
      } );

  }
}

export function fetchMessagePromise() {
  const request = axios.get(ROOT_URL, {
    headers: {authorisation: localStorage.getItem('token')}
  });

  console.log(request);

  return {
    type: FETCH_MESSAGE,
    payload: request
  };
}

export function removeSelectedRecipe() {
  return {
    type: REMOVE_SELECTED_RECIPE
  }
}
