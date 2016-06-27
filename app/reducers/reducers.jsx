//EXPORT REDUCERS - LINK UP IN THE STORE

export var authReducer = (state_auth = {},action) => {
  switch (action.type) {

    case 'LOGIN':
      return {
        uid: action.uid
      };

    default:
      return state_search_text;

  }
};
