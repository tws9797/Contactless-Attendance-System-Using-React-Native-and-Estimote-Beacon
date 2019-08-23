import {
  GET_USER_CLASSES,
  LOAD_RECORDS,
  GET_USER_NAME
} from '../actions/types';

const INITIAL_STATE = {
  name: '',
  course: '',
  records: null,
  recordLoading: false
};

export default (state=INITIAL_STATE, action) => {
  switch(action.type){
    case GET_USER_NAME:
      return { ...state, name: action.payload.name, course: action.payload.course}
    case LOAD_RECORDS:
      return {...state, recordLoading: true}
    case GET_USER_CLASSES:
      return {...state, records: action.payload.newRecords, recordLoading: false};
    default:
      return state;
  }
}
