//EXAMPLES

//Object - synchronous

//AND FUNCTION asynchronous


export var setSearchText = (searchText) => {
  return {
    type: 'SET_SEARCH_TEXT',
    searchText
  }
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
