import axios from 'axios';
import {browserHistory} from 'react-router';
import {AUTH_USER, AUTH_ERROR, UNAUTH_USER, FETCH_MESSAGE, SAVE_USER, GET_POSTS, GET_POST, SET_SEARCH_TEXT, REMOVE_AUTH_ERROR, TOGGLE_OFFLINE, REMOVE_SELECTED_RECIPE, START_LOADING, END_LOADING, REMOVE_UI_MESSAGE, UI_MESSAGE} from './types';
var Dexie = require('dexie');

const ROOT_URL = 'https://stirapi.herokuapp.com';

export var toggleOffline = (post_id,offlineStatus) => {
  return function(dispatch) {
    axios.put(`${ROOT_URL}/changeOfflineStatus`, {post_id,offlineStatus}, {
      headers: {
        authorisation: localStorage.getItem('token')
      }
    })
      .then( (response) => {
        console.log('response from toggleOffline action ', response);

        if (window.indexedDB) {
          var db = new Dexie('Stir');
          db.version(1).stores({
            posts: '_id, title, user_id, text, offline',
            users: 'user_id, email, firstName, lastName, token'
          });

          //delete post from IDB if offline status is false
          if (!offlineStatus) {
            db.open().then( function() {
            return db.posts
              .where("_id")
              .equals(post_id)
              .delete();
            } ).then( function(doc) {
              console.log('doc',doc);
            } );

            //else add post in to IDB as it is now available offline
          } else {
            response.data.forEach( (post) => {
              if (post._id === post_id) {
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
export function signinUser(email,password) {
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

        //--save JWT token
        localStorage.setItem('token', response.data.token);
        //save personal info - for future - profile page etc
        localStorage.setItem('user_id', response.data.user_id);
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('firstName', response.data.forename);
        localStorage.setItem('lastName', response.data.surname);
        localStorage.setItem('lastName', response.data.surname);

        //putting checks in for IDB
        if (window.indexedDB) {
          //IDB save
          var db = new Dexie('Stir');
          db.version(1).stores({
            posts: '_id, title, user_id, text, offline',
            users: 'user_id, email, firstName, lastName, token'
          });

          // Open the database
        	// db.open().catch(function(error) {
        	// 	alert('Uh oh : ' + error);
        	// });
          //IDB add
        	db.users.add({
        		user_id: response.data.user_id,
        		email: response.data.email,
            firstName: response.data.forename,
            lastName: response.data.surname,
            token: response.data.token
        	});
        }

        //--redirect to '/posts'
        dispatch(endLoading());
        browserHistory.push('/posts/create');

      } )
      .catch( (err) => {
        //if request is bad
        //--show error to user
        console.log('error from sign in', err);
        if (err.response.status === 503) {
          dispatch(endLoading());
          dispatch(authError('No internet connection :('));
        } else {
          dispatch(endLoading());
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

        if (window.indexedDB) {
          var db = new Dexie('Stir');
          db.version(1).stores({
            posts: '_id, title, user_id, text, offline',
            users: 'user_id, email, firstName, lastName, token'
          });

          // Open the database
        	db.open().catch(function(error) {
        		alert('Uh oh : ' + error);
        	});
          db.users.add({
        		user_id: response.data.user_id,
        		email: response.data.email,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            token: response.data.token
        	});
        }
        localStorage.setItem('token', response.data.token);
        dispatch(endLoading());

        browserHistory.push('/posts/create');
      })
      .catch( err => {
        console.log('error from sign up', err);
        if (err.response.status === 503) {
          dispatch(endLoading());
          dispatch(authError('No internet connection :('));
        } else {
          dispatch(endLoading());
          dispatch(authError(err.response.data.error));
        }

      });
  }
}

export function getUserPosts(user_id, token){
  return function(dispatch) {

    if (window.indexedDB) {
      var db = new Dexie('Stir');
      db.version(1).stores({
        posts: '_id, title, user_id, text, offline',
        users: 'user_id, email, firstName, lastName, token'
      });

      // Open the database
      db.open().catch(function(error) {
        alert('Uh oh : ' + error);
      });

      db.posts.toArray().then( (posts) =>  {
        console.log('posts:', posts);
        if (posts.length > 0) {
          dispatch( {type: GET_POSTS, payload: posts} );
        }
      });
    }

    axios.get(`${ROOT_URL}/getPosts?user_id=${user_id}`, {
      headers: {
        authorisation: localStorage.getItem('token')
      }
    }).then( (response) => {
      console.log('response from getPosts action ', response);

      dispatch( {type: GET_POSTS, payload: response.data} );
      dispatch(endLoading());

      response.data.forEach( (post) => {

        if (post.offline) {

          if (window.indexedDB) {
            db.posts.get(post._id).then( (result) => {
              if (result) {
                //console.log('Post is already in db', post.title);
              } else {
                //console.log('Post not in db', post.title);
                //useful if a posts offline status has changed
                db.posts.add({
                  _id: post._id,
                  title: post.title,
                  user_id: post.user_id,
                  text: post.text,
                  offline: post.offline
                });
              }
            } )
          }
        }
      } );

    })
      .catch( (err) => {
        console.log('error from get posts action', err);
        if (err.response.status === 503) {

          dispatch(endLoading());
          dispatch(authError('No internet connection, but you can view your offline posts! '));
        } else {
          dispatch(endLoading());
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

      if (window.indexedDB) {
        var db = new Dexie('Stir');
        db.version(1).stores({
          posts: '_id, title, user_id, text, offline',
          users: 'user_id, email, firstName, lastName, token'
        });

        db.open().then( function() {
        return db.posts
          .where("_id")
          .equals(post_id)
          .delete();
        } ).then( function(doc) {
          console.log('doc',doc);
        } );
      }
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

export function sendPost({title,text, user_id}) {
  return function(dispatch) {

    var user_push_id = localStorage.getItem('userPushId');

    //MIGHT NEED TO ERROR HANDLE LACK OF USER_ID in IDB
    return axios.post(`${ROOT_URL}/sendPost`, {
      title,
      user_id,
      text,
      offline: false,
      user_push_id: user_push_id
      },
      {
        headers: {
          authorisation: localStorage.getItem('token')
        }
      } )
      .then( response => {
        console.log('response',response);

        dispatch(endLoading());
        browserHistory.push('/posts/view');


      })
      .catch( err => {
        console.log('error from send posts action', err);
        if (err.response.status === 503) {

          dispatch(endLoading());
          dispatch(authError('You\'re Offline! Please try again when you are online!'));

          // if ('serviceWorker' in navigator && 'SyncManager' in window) {
          //   navigator.serviceWorker.ready.then(function(reg) {
          //
          //     var db = new Dexie('Outbox');
          //     db.version(1).stores({
          //       posts: '++id, title, user_id, text, offline'
          //     });
          //
          //     db.posts.add({
          //       title,
          //       user_id: doc[0].user_id,
          //       text,
          //       offline: false
          //     }).then( (doc) => {
          //       console.log('outbox doc', doc);
          //     } ).catch( (err) => {
          //       console.log(err);
          //     } )
          //
          //     return reg.sync.register('send_post');
          //   }).catch(function() {
          //     // system was unable to register for a sync,
          //     // this could be an OS-level restriction
          //     dispatch(removeAuthError());
          //     dispatch(authError('You\'re Offline! But syncing in the background is not available.!'));
          //   });
          // }
          // else {
          //   // serviceworker/sync not supported
          //   dispatch(removeAuthError());
          //   dispatch(authError('You\'re Offline! But syncing in the background is not available.!'));
          // }

        } else {
          dispatch(endLoading());
          dispatch(authError(err.response.data.error));
        }
      });


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

export function uiMessage(message) {
  return {
    type: UI_MESSAGE,
    payload: message
  }
}

export function removeUiMessage() {
  return {
    type: REMOVE_UI_MESSAGE,
    payload: ''
  }
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  }
}

export function removeAuthError() {
  return {
    type: REMOVE_AUTH_ERROR,
    payload: ''
  }
}

export function startLoading() {
  return {
    type: START_LOADING
  }
}

export function endLoading() {
  return {
    type: END_LOADING
  }
}

export function signoutUser(user_id) {
  return function(dispatch) {
    localStorage.removeItem('token');
    dispatch({type: UNAUTH_USER});

    if (window.indexedDB) {
      var db = new Dexie('Stir');
      db.version(1).stores({
        posts: '_id, title, user_id, text, offline',
        users: 'user_id, email, firstName, lastName, token'
      });

      db.delete();
    }
  }
}

export function resetPassword(email, oldPassword, newPassword) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/resetPassword`, { email, oldPw: oldPassword, newPw: newPassword })
    .then( (response) => {
      console.log('data from request: ' , response.data);
      if (response.data.success) {
        dispatch(endLoading());
        dispatch(uiMessage('Your password has been reset successfully.'));
        browserHistory.push('/profile');
        console.log('SUCCESS');
      } else if (response.data.error) {
        dispatch(authError('Incorrect Password.'));
      }
    } )
  }
}

export function forgottenPassword(email) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/forgottenPassword`, {email})
    .then( (response) => {
      console.log('response from forgotten password', response);
    } )
  }
}

export function removeSelectedRecipe() {
  return {
    type: REMOVE_SELECTED_RECIPE
  }
}
