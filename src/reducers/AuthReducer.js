import {
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER,
  GET_USER_ID
 } from '../actions/types';

//Default state when user uninstall application or clear data
const INITIAL_STATE = {
  email: 'tws@test.com',
  password: 'password',
  user: null,
  error: ' ', //To create an invisible row
  loading: false,
 };

 //Reducer:
 //Function that takes the previous state and an action as arguments and returns a new state.
 //Reducers specify how the application's state changes in response to actions that are dispatched to the store.
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case EMAIL_CHANGED:
      //Make a new object that consist of the existing state's property
      //Throw property email on top of the existing state
      return { ...state, email: action.payload };
    case PASSWORD_CHANGED:
      return { ...state, password: action.payload };
    case LOGIN_USER_SUCCESS:
      return { ...state, ...INITIAL_STATE, user: action.payload, loading: false };
    case LOGIN_USER_FAIL:
      return { ...state, error: 'Authentication Failed.', loading: false };
    case LOGIN_USER:
      return { ...state, loading: true, error: ' ' };
    case GET_USER_ID:
      return { ...state, loading: false };
    default:
      return state;
  }
};
