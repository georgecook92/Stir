// cached items
var CACHE_ARRAY = [
  '/',
  'posts/create',
  '/posts/view',
  '/bundle.js',
  '/signin',
  '/signup',
  '/signout',
  '/manifest.json'
];

var CACHE_NAME = 'v6';

function openDatabase(name) {
  return new Promise(function(resolve, reject) {
    if (window.indexedDB) {
      var version = 10;
      var request = indexedDB.open(name, version);
      var db;
      request.onupgradeneeded = function(e) {
        db = e.target.result;
        e.target.transaction.onerror = reject;
      };
      request.onsuccess = function(e) {
        db = e.target.result;
        console.log('OPENED DATABASE');
        resolve(db);
      };
      request.onerror = reject;
    }
  });
}

function databaseGet(type,db) {
  return new Promise(function(resolve, reject) {
    if (window.indexedDB) {
      var transaction = db.transaction([type], 'readonly');
      var store = transaction.objectStore(type);
      var request = store.getAll();
      request.onsuccess = function(e) {
        var result = e.target.result;
        resolve(result);
      };
      request.onerror = reject;
    }
  });
}

function databaseGetById(type, id, db) {
  return new Promise(function(resolve, reject) {
    if (window.indexedDB) {
      var transaction = db.transaction([type], 'readonly');
      var store = transaction.objectStore(type);
      var request = store.get(id);
      request.onsuccess = function(e) {
        var result = e.target.result;
        resolve(result);
      };
      request.onerror = reject;
    }
  });
}

function sendAllFromOutbox(posts) {
  return fetch('https://stirapi.herokuapp.com/sendPost', {
    headers: {'Content-Type': 'application/json'},
    method: "POST",
    body: JSON.stringify(posts)
  })
  .then( (response) => {
    console.log('response from SW sendAllFromOutbox', response);
  } )
  .catch( (err) => {
    console.log('error from SW sendAllFromOutbox',err);
  } )
}

//install event
self.addEventListener('install', (event) => {
  console.log('install from SW');
  event.waitUntil(
    caches.open(CACHE_NAME).then( (cache) => {
      cache.addAll(CACHE_ARRAY)
    })
  );
});

//activate - cleans up old caches if they are still around
self.addEventListener( 'activate' , (event) => {
  var cacheWhitelist = CACHE_NAME;

  event.waitUntil(
    caches.keys().then( (keyList) => {
      return Promise.all( keyList.map( (key) => {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});

var getStaleWhileRevalidate = function (request, cache) {
    return cache.match(request).then(function (response) {
        var fetchPromise = fetch(request).then(function(networkResponse) {
            if (networkResponse.status !== 200) {
                throw new Error('Bad response');
            }
            cache.put(request, networkResponse.clone());
            return networkResponse;
        });
        return response || fetchPromise;
    });
};

//fetch event
self.addEventListener( 'fetch', (event) => {

  //console.log('[ServiceWorker] Fetch event', event.request);

   var requestURL = new URL(event.request.url);

//these have their own response handling so that if it is offline - a 503 can be sent

  if (event.request.url === 'https://stirapi.herokuapp.com/signin' ||
      event.request.url === 'https://stirapi.herokuapp.com/signup' ||
      event.request.url === 'https://stirapi.herokuapp.com/changeOfflineStatus' ||
      event.request.url === 'https://stirapi.herokuapp.com/deletePost' ||
      event.request.url === 'https://stirapi.herokuapp.com/sendPost' ) {
    console.log('Logged from sign in - SW');
    event.respondWith(

      caches.match(event.request)
      .then((response) => {
        //if response is truthy return it - else fetch the network
        //if error in network call the fallback

        response ? console.log('returned from cache') : console.log('attempt to network');

        if (response) {
          console.log('response from cache: sw', response);
          return response;
        } else {
          return fetch(event.request)
          .then( (response) => {
            console.log('response from SW network: ', response);
            return response;
          } )
          .catch( () => {
            console.log('network failed');
            return new Response( { "error": "No Network" } , {
              ok: false,
              status: 503,
              headers: {
                'Content-Type' : 'application/json'
              }
            })
          } );
        }
      })
    );
  }

  else if (event.request.url.indexOf('https://stirapi.herokuapp.com/getPosts?user_id') > -1) {

    var resObj = [{title:"Mac and cheese",_id:"579f6d34a1d8c41100ab70cc",offline:true,user_id:"579b4194cfe5401100c4d315",text:"Lots of cheese. Done."}, {title:"Offline Post",_id:"47999f6d34a1d8c41100bb70cc",offline:true,user_id:"579b4194cfe5401100c4d315",text:"Offline. Done. 2"}];



      event.respondWith(
        fetch(event.request).then( (response) => {
          return response;
        } ).catch( (err) => {
          return new Response( { "error": "No Network" } , {
            ok: false,
            status: 503,
            headers: {
              'Content-Type' : 'application/json'
            }
          });
        } )
      );
  }

  else if (event.request.url.indexOf('https://stirapi.herokuapp.com/viewPost') > -1) {

    var resObj = [{title:"Mac and cheese",_id:"579f6d34a1d8c41100ab70cc",offline:true,user_id:"579b4194cfe5401100c4d315",text:"Lots of cheese. Done."}];
    var resObj2 = [{title:"Offline Post 2",_id:"47999f6d34a1d8c41100bb70cc",offline:true,user_id:"579b4194cfe5401100c4d315",text:"Offline. Done. 2"}];
    var param = event.request.url.replace('https://stirapi.herokuapp.com/viewPost/','');
    console.log('param from SW', param);

    var obj = { data: {} };

    event.respondWith(

      caches.match(event.request).then( (response) => {
        if (response) {
          return response;
        } else {
          return openDatabase( 'Posts' ).then( (db) => {
            return databaseGetById('posts', param, db)
              .then( (post) => {
                if (post) {
                  post = [post];
                  console.log(post);
                  return new Response( JSON.stringify(post), {
                    headers: {'Content-Type': 'application/json'}
                  } );
                } else {
                  return fetch(event.request).then( (response) => {
                    console.log('response came from new IDB else', response);
                    return response;
                  })
                  .catch( (err) => {
                    console.log('err from IDB else', err);
                  } );
                }
              } )
          } )
        }
      } )


    );
  }

  else if(event.request.url === 'https://cdn.onesignal.com/sdks/OneSignalSDK.js') {
    event.respondWith(
      fetch(event.request).then( (response) => {
        return response;
      } ).catch( (err) => {
        console.log(err);
      } )
    );
  }

  else {
    event.respondWith(
      caches.open(CACHE_NAME).then( function(cache) {
        return getStaleWhileRevalidate(event.request, cache);
      })
    );
  }

} );

self.addEventListener('sync', function(event) {
  if (event.tag == 'send_post') {
    //const URL
    console.log('sync from SW - send post');

    event.waitUntil(
      openDatabase('Outbox').then( (db) => {
        return databaseGet('posts', db).then( (posts) => {
          console.log('result from get:',posts);
          return sendAllFromOutbox(posts)
        } )
      } )

    );
  }
});
