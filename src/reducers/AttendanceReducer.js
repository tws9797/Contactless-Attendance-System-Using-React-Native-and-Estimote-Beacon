import {
  GET_USER_INFO,
  GET_NEXT_CLASS,
  CHECK_ATTENDANCE,
  ENTER_CLASS,
  EXIT_CLASS,
  IN_CLASS,
  NO_CLASS,
  CHECK_LOCATION,
  FAILED_ATTENDANCE,
  DISMISS_MODAL,
  DISMISS_BLUETOOTH_MODAL,
  TOGGLE_BLUETOOTH_MODAL
} from '../actions/types';

const INITIAL_STATE = {
  name: '',
  studID: '',
  course: '',
  room: null,
  className: null,
  startTime: null,
  endTime: null,
  loading: true,
  time: 0,
  status: null,
  inClass: null,
  attStatus: false,
  isAttendanceModalVisible: false,
  attendanceTaken: false,
  checking: false,
  location: false,
  attendance: true,
  isBluetoothModalVisible: false
};

export default (state=INITIAL_STATE, action) => {
  switch(action.type){
    case GET_USER_INFO:
      return {
        ...state,
        studID: action.payload.studID,
        name: action.payload.name,
        course: action.payload.course,
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
        courseCode: action.payload.courseCode,
        attendanceTaken: action.payload.attendanceTaken,
        status: 1,
        loading: false
      };
    case NO_CLASS:
      return {
        ...state,
         status: 0,
         loading: false
      }
    case ENTER_CLASS:
      return {
        ...state,
        inClass: action.payload.inClass,
        time: action.payload.time,
        checking: false
      }
    case EXIT_CLASS:
      return { ...state, inClass: action.payload.inClass }
    case CHECK_ATTENDANCE:
      return {
        ...state,
         disable: true,
         attendanceTaken: true,
         isAttendanceModalVisible: false,
         attendance: true,
         time: 0
        }
    case CHECK_LOCATION:
      return { ...state, isAttendanceModalVisible: true, checking: true, attendance: true }
    case FAILED_ATTENDANCE:
      return { ...state, attendance: false, status: 0, time: 0 }
    case DISMISS_MODAL:
      return { ...state, isAttendanceModalVisible: false }
    case TOGGLE_BLUETOOTH_MODAL:
      return { ...state, isBluetoothModalVisible: true }
    case DISMISS_BLUETOOTH_MODAL:
      return { ...state, isBluetoothModalVisible: false }
    default:
      return state;
  }
}
