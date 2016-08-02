export default function({email,user_id,firstName,lastName,token}) {

  

  // var indexedDB = window.indexedDB || window.webkitIndexedDB || window.msIndexedDB;
  // var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
  // var openCopy = indexedDB && indexedDB.open;
  //
  // var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
  //
  // if (IDBTransaction)
  // {
  //     IDBTransaction.READ_WRITE = IDBTransaction.READ_WRITE || 'readwrite';
  //     IDBTransaction.READ_ONLY = IDBTransaction.READ_ONLY || 'readonly';
  // }
  //
  // var request = indexedDB.open('user');
  //
  // request.onupgradeneeded = function(e)
  // {
  //     // e is an instance of IDBVersionChangeEvent
  //     var idb = e.target.result;
  //
  //     if (idb.objectStoreNames.contains('users'))
  //     {
  //         idb.deleteObjectStore('users');
  //     }
  //
  //     var store = idb.createObjectStore('users', {keyPath: 'text', autoIncrement: true});
  //     // createIndex operations possible to be pefromed on store.createIndex
  //     store.createIndex('by_user', 'user', {unique: true, multiEntry: false});
  // };
  //
  // var data = {
  //   email,
  //   user_id,
  //   firstName,
  //   lastName,
  //   token
  // };
  //
  // request.onsuccess = function(e) {
  //   var idb = e.target.result;
  //   var trans = idb.transaction('users', IDBTransaction.READ_WRITE);
  //   var store = trans.objectStore('users');
  //
  //   // add
  //   var requestAdd = store.add(data);
  //
  //   requestAdd.onsuccess = function(e) {
  //       console.log('SUCCESS');
  //   };
  //
  //   requestAdd.onerror = function(e) {
  //       // failed
  //       console.log('FAILED');
  //   };
  // };
  //
  //
  // // var requestRead = indexedDB.open('todos');
  // //
  // // requestRead.onsuccess = function(e) {
  // //     var idb = e.target.result;
  // //     var transaction = idb.transaction('todo', IDBTransaction.READ_ONLY);
  // //     var objectStore = transaction.objectStore('todo');
  // //
  // //     var todosArray = [];
  // //
  // //     objectStore.openCursor().onsuccess = function(event, callback)
  // //     {
  // //         var cursor = event.target.result;
  // //         if (cursor)
  // //         {
  // //             //console.log('Cursor data', cursor.value);
  // //             cursor.continue();
  // //             todosArray.push(cursor.value.key);
  // //
  // //         }
  // //         else
  // //         {
  // //             console.log('Entries all displayed.');
  // //         }
  // //
  // //     };
  // //
  // //     transaction.oncomplete = () => {
  // //       console.log('array', todosArray);
  // //     };
  // // };

}
