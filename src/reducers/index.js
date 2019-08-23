import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import AttendanceReducer from './AttendanceReducer';
import RecordReducer from './RecordReducer';


//combineReducers:
//Function that calls all reducers with the slice of state selected according to their key.
//Combines the results into a single object once again.
export default combineReducers({
  auth: AuthReducer,
  att: AttendanceReducer,
  record: RecordReducer
});
