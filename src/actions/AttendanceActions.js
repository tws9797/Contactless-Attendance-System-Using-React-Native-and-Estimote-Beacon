  import {
  GET_USER_INFO,
  GET_NEXT_CLASS,
  ESTIMOTE_APP_ID,
  ESTIMOTE_APP_TOKEN,
  START_ATTENDANCE,
  IN_CLASS,
  EXIT_CLASS,
  INCREASE_TIME,
  CHECK_ATTENDANCE,
  TOGGLE_MODAL,
  DISMISS_MODAL,
  NO_CLASS,
  ENTER_CLASS,
  CHECK_LOCATION
} from './types.js';
import firebase from 'firebase';
import * as RNEP from '@estimote/react-native-proximity';
import BackgroundTimer from '../BackgroundTimer';


//Get user info
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

  //Get current day of the week
  //Sunday => 0, Monday => 1...
  let day = new Date().getDay();

  //Get current user
  const { currentUser } = firebase.auth();
  //Get class of student enrollments
  const studEnrollRef =   firebase.database().ref(`stud_enrollments/${currentUser.uid}/${day}`);
  //Get all classes
  const classRef = firebase.database().ref('classes');
  //Get current user status (if there is no class for the rest of the day, 0; else, 1)
  const userStatus = firebase.database().ref(`users/${currentUser.uid}/status`);
  //Initialize the next class
  let nextClass = null;

  return(dispatch) => {
    dispatch({
      type: GET_NEXT_CLASS
    });
    //Get the user status
    userStatus.once('value', status => {

        //Get the student enrolled classes at that day order by startTime
        studEnrollRef.orderByChild('startTime').on('value', studEnroll => {
            //If there is classes that day, proceed
            if(studEnroll.exists()){
              //Get each classes
              studEnroll.forEach(studClass => {
                nextClass = studClass.val();
                //If the class has not began, return the first class on occurence
                checkClass(dispatch, classRef, studClass, userStatus, nextClass, currentUser);
                //Set status due to noSQL cannot retrieve data programatically based on value
                //The status is to notify whether there is no classes already or not
                userStatus.set(0);
              });
            }
            //If there are no classes that day, set the user status to 0 and dispatch no class notification
            else {
              userStatus.set(0);
              noClass(dispatch, nextClass);
            }
        });

        //If there are classes that day, but all the classes has been finished
        if(status.val() === 0){
          noClass(dispatch, nextClass);
        }
    });
  }
};

const noClass = (dispatch, nextClass) => {
  //Status 0 => No class, Disable the button first
  dispatch({
    type: NO_CLASS,
  });
}

const checkClass = (dispatch, classRef, studClass, userStatus, nextClass, currentUser) => {
  //Get current hour of the day
  let hour = new Date().getHours();
  const date = new Date().toDateString();

  const userAttStatus = firebase.database().ref(`users/${currentUser.uid}/attStatus`);
  const userAttRef = firebase.database().ref(`user_attendances/${studClass.key}/${date}/${currentUser.uid}`);
    //If class is in process
    if(hour >= studClass.val().startTime && hour < studClass.val().endTime){
      classRef.child(studClass.key).once('value', classDesc => {
        userStatus.set(1);
        //Status 1 => In class, Enable the button
        userAttRef.once('value', userAtt => {
            if(userAtt.exists())
              if(userAtt.val()){
                console.log
                dispatch({
                  type: IN_CLASS,
                  payload: {...nextClass, ...classDesc.val(), attendanceTaken: true }
                });
                return true;
              }
            dispatch({
              type: IN_CLASS,
              payload: {...nextClass, ...classDesc.val(), attendanceTaken: false }
            });
        });
      });
      return true;
    }
  //Both action are similar except the status value is to exit the loop as soon as the first occurence is found
}

/*export const checkCurrentLocation = (room) => {

  const checkLocation = new RNEP.ProximityZone(5, room);
  var notFound = true;
  var time = 0;

  checkLocation.onEnterAction = context => {
    notFound = false;
  }

  return(dispatch) => {
      dispatch({
        type: CHECK_LOCATION
      });

      const timer = BackgroundTimer.setInterval(() => {
          time++;

        if(!notFound){
          RNEP.proximityObserver.stopObservingZones();
          BackgroundTimer.clearInterval(timer);
          dispatch({type: RIGHT_LOCATION});
        }
        if(time > 20){
          RNEP.proximityObserver.stopObservingZones();
          BackgroundTimer.clearInterval(timer);
          dispatch({type: WRONG_LOCATION});
        }
      }, 1000);

      RNEP.locationPermission.request().then(
        permission => {
          if (permission !== RNEP.locationPermission.DENIED) {
            const credentials = new RNEP.CloudCredentials(
              ESTIMOTE_APP_ID,
              ESTIMOTE_APP_TOKEN
            );

            RNEP.proximityObserver.initialize(credentials);
            RNEP.proximityObserver.startObservingZones([checkLocation]);
          }
        },
        error => {
          console.error("Error when trying to obtain location permission", error);
        }
      );
    }
}*/

export const startProximityObserver =  (room, criteria) => {


    //Get current user
    const { currentUser } = firebase.auth();

    //Get current date
    const date = new Date().toDateString();
    const userAttRef = firebase.database().ref(`user_attendances/UECS1234/${date}/${currentUser.uid}`);

    const zone = new RNEP.ProximityZone(5, room);
    var time = 0;
    const userAtt = firebase.database().ref(`users/${currentUser.uid}/att`);
    const userAttStatus = firebase.database().ref(`users/${currentUser.uid}/attStatus`);

    return(dispatch) => {
      dispatch({
        type: CHECK_LOCATION
      });

      zone.onEnterAction = () => {
        console.log("test");
        const timer = BackgroundTimer.setInterval(() => {
          userAtt.set(time);
          console.log(time);
          if(time >= 20){
            BackgroundTimer.clearInterval(timer);
            RNEP.proximityObserver.stopObservingZones();
            userAttRef.set({
              attendance: true
            });
            dispatch({
              type: CHECK_ATTENDANCE,
            })
          }
          dispatch({
            type: ENTER_CLASS,
            payload: { inClass: true, time: time++ }
          });
        }, 1000);
      };

      zone.onExitAction = () => {
        dispatch({
          type: EXIT_CLASS,
          payload: { inClass: false }
        });
      };

      RNEP.locationPermission.request().then(
        permission => {

          if (permission !== RNEP.locationPermission.DENIED) {
            const credentials = new RNEP.CloudCredentials(
              ESTIMOTE_APP_ID,
              ESTIMOTE_APP_TOKEN
            );

            RNEP.proximityObserver.initialize(credentials);
            RNEP.proximityObserver.startObservingZones([zone]);
          }
        },
        error => {
          console.error("Error when trying to obtain location permission", error);
        }
      );
    }
};

export const dismissModal = () => {
  return {
    type: DISMISS_MODAL,
    payload: { isModalVisible: true }
  };
}

export const toggleModal = () => {
  return {
    type: TOGGLE_MODAL,
    payload: { isModalVisible: true }
  };
}
