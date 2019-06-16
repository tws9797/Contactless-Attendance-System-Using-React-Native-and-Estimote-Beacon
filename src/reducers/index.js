import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';


//combineReducers:
//Function that calls all reducers with the slice of state selected according to their key.
//Combines the results into a single object once again.
export default combineReducers({
  auth: AuthReducer
});
