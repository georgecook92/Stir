//EXAMPLES

//Object - synchronous

//AND FUNCTION asynchronous

//sync redux store
export var login = (uid) => {
  return {
    type: 'LOGIN',
    uid
  };
};

export var startAddTodo = (text) => {
  return (dispatch, getState) => {
    var todo = {
      text,
      completed: false,
      createdAt: moment().unix(),
      completedAt: null
    }

    var uid = getState().auth.uid;

    var todoRef = firebaseRef.child(`users/${uid}/todos`).push(todo);

    return todoRef.then( () => {

      IDB_Add_Todo(text, todoRef.key);

      dispatch(addTodo({
        ...todo,
        id: todoRef.key
      }));
    });
  };
};
