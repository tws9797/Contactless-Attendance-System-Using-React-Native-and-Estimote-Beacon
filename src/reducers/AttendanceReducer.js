import {
  GET_DATE,
  GET_USER_INFO,
  GET_NEXT_CLASS
} from '../actions/types';

const INITIAL_STATE = {
  date: '',
  studID: '',
  name: '',
  className: null,
  startTime: null,
  endTime: null,
  loading: true,
};

export default (state=INITIAL_STATE, action) => {
  switch(action.type){
    case GET_DATE:
      return { ...state, date: action.payload};
    case GET_USER_INFO:
      return { ...state, studID: action.payload.studID, name: action.payload.name };
    case GET_NEXT_CLASS:
      return {
        ...state,
        className: action.payload.desc,
        startTime: action.payload.startTime,
        endTime: action.payload.endTime,
        status: action.payload.status,
        loading: false
      };
    default:
      return state;
  }
}
