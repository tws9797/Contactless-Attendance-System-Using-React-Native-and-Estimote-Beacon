  import {
  GET_DATE,
  GET_USER_INFO,
  GET_NEXT_CLASS
} from './types.js';
import firebase from 'firebase';
import moment from 'moment';

export const getDate = () => {
  const today = new Date();
  const date = moment(today).format("MMMM D, YYYY");

  return {
    type: GET_DATE,
    payload: date
  }
}

export const getUserInfo = () => {
  const { currentUser } = firebase.auth();

  return(dispatch) => {
    firebase.database().ref(`users/${currentUser.uid}`)
      .on('value', snapshot => {
        dispatch({ type: GET_USER_INFO, payload: snapshot.val() });
      });
  }
};

export const getNextClass = () => {

  let day = new Date().getDay();
  let hour = new Date().getHours();
  const { currentUser } = firebase.auth();
  const studEnrollRef =   firebase.database().ref(`stud_enrollments/${currentUser.uid}/${day}`);
  const classRef = firebase.database().ref('classes');
  const userStatus = firebase.database().ref(`users/${currentUser.uid}/status`);
  let nextClass = null;

  return(dispatch) => {
    userStatus.once('value', status => {
      studEnrollRef.orderByChild('startTime').on('value', studEnroll => {
        studEnroll.forEach(studClass => {
          if(hour < studClass.val().startTime){
            classRef.child(studClass.key).once('value', classDesc => {
              nextClass = studClass.val();
              userStatus.set(1);
              dispatch({
                type: GET_NEXT_CLASS,
                payload: {...nextClass, desc: classDesc.val().desc, status: 2 }
              });
            });
            return true;
          }
          else if(hour >= studClass.val().startTime && hour < studClass.val().endTime){
            classRef.child(studClass.key).once('value', classDesc => {
              nextClass = studClass.val();
              userStatus.set(1);
              dispatch({
                type: GET_NEXT_CLASS,
                payload: {...nextClass, desc: classDesc.val().desc, status: 1 }
              });
            });
            return true;
          }
          userStatus.set(0);
        });
      });
      if(status.val() === 0){
        dispatch({
          type: GET_NEXT_CLASS,
          payload: {...nextClass, status: 0 }
        });
      }
    });
  }

};
