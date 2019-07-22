import {
  GET_USER_INFO,
  GET_NEXT_CLASS,
  START_ATTENDANCE,
  ENTER_CLASS,
  EXIT_CLASS,
  INCREASE_TIME,
  CHECK_ATTENDANCE,
  IN_CLASS,
  NO_CLASS,
  CHECK_LOCATION
} from '../actions/types';

const INITIAL_STATE = {
  studID: '',
  name: '',
  room: null,
  className: null,
  startTime: null,
  endTime: null,
  loading: true,
  time: 0,
  inClass: null,
  attStatus: false,
  isModalVisible: false,
  attendanceTaken: false,
  checking: false,
  location: false
};

export default (state=INITIAL_STATE, action) => {
  switch(action.type){
    case GET_USER_INFO:
      return {
        ...state,
        studID: action.payload.studID,
        name: action.payload.name,
        attStatus: action.payload.attStatus
      };
    case GET_NEXT_CLASS:
      return { ...state, loading: true }
    case IN_CLASS:
      return {
        ...state,
        className: action.payload.desc,
        room: action.payload.room,
        startTime: action.payload.startTime,
        endTime: action.payload.endTime,
        status: 1,
        disable: false,
        loading: false,
        attendanceTaken: action.payload.attendanceTaken
      };
    case NO_CLASS:
      return {
        ...state,
         status: 0,
         disable: true,
         loading: false
      }
    case ENTER_CLASS:
      return { ...state, inClass: action.payload.inClass, time: action.payload.time, checking: false }
    case EXIT_CLASS:
      return { ...state, inClass: action.payload.inClass }
    case CHECK_ATTENDANCE:
      return {
        ...state,
         disable: true,
         attendanceTaken: true,
         isModalVisible: false,
        }
    case CHECK_LOCATION:
      return { ...state, checking: true, isModalVisible: true, inClass: false }
    default:
      return state;
  }
}
