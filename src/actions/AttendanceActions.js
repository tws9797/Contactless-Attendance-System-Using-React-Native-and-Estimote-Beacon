import {
  GET_USER_INFO,
  GET_NEXT_CLASS,
  START_ATTENDANCE,
  IN_CLASS,
  EXIT_CLASS,
  CHECK_ATTENDANCE,
  DISMISS_MODAL,
  NO_CLASS,
  ENTER_CLASS,
  CHECK_LOCATION,
  FAILED_ATTENDANCE,
  ESTIMOTE_APP_ID,
  ESTIMOTE_APP_TOKEN,
  TOGGLE_BLUETOOTH_MODAL,
  DISMISS_BLUETOOTH_MODAL
} from './types.js';
import Firebase from '../Firebase';
import * as RNEP from '@estimote/react-native-proximity';
import BackgroundTimer from '../BackgroundTimer';
let inClass = false;
//Get user info
export const getUserInfo = () => {
  const { currentUser } = Firebase.auth();
  return(dispatch) => {
    Firebase.database().ref(`users/${currentUser.uid}`)
      .on('value', snapshot => {
        dispatch({ type: GET_USER_INFO, payload: snapshot.val() });
      });
  }
};

export const getNextClass = () => {

  //Get current day of the week
  //Sunday => 0, Monday => 1...
  const day = new Date().getDay();

  //Get current user
  const { currentUser } = Firebase.auth();
  //Get class of student enrollments
  const studEnrollRef =   Firebase.database().ref(`stud_enrollments/${currentUser.uid}/${day}`);
  //Get all classes
  const classRef = Firebase.database().ref('classes');
  //Get current user status (if there is no class for the rest of the day, 0; else, 1)
  const userStatus = Firebase.database().ref(`users/${currentUser.uid}/status`);

  return(dispatch) => {

    dispatch({
      type: GET_NEXT_CLASS
    });

    inClass = false;

    //Get the student enrolled classes at that day order by startTime
    studEnrollRef.orderByChild('startTime').once('value').then(studEnroll => {

      //If there is classes that day, proceed
      if(studEnroll.exists()){
        //Get each classes
        studEnroll.forEach(studClass => {
          let nextClass = studClass.val();
          //If the class has not began, return the first class on occurence
          checkClass(dispatch, classRef, studClass, userStatus, nextClass, currentUser);
        });
      }
      //If there are no classes that day, set the user status to 0 and dispatch no class notification
      else {
          noClass(dispatch, currentUser);
      }
    }).then(() => {
      //If there are classes that day, but all the classes has been finished
      if(!inClass){
        noClass(dispatch, currentUser);
      }
    });
  }
};

const noClass = (dispatch, currentUser) => {

  const userAtt = Firebase.database().ref(`users/${currentUser.uid}/att`);

  //Reset the attendance status
  //To prevent user kill the app in background during taking attendance
  userAtt.set(0).then(() => {
    dispatch({
      type: NO_CLASS,
    });
  });

}

const checkClass = (dispatch, classRef, studClass, userStatus, nextClass, currentUser) => {
  //Get current hour of the day
  const hour = new Date().getHours();
  const date = new Date().toDateString();

  //If class is in process
  if(hour >= studClass.val().startTime && hour < studClass.val().endTime){
    inClass = true;
    const userAttRef = Firebase.database().ref(`user_attendances/${studClass.key}/${date}/${currentUser.uid}`);

    classRef.child(studClass.key).once('value', classDesc => {
        userAttRef.once('value', userAtt => {
            if(userAtt.exists()){
              if(userAtt.val().attendance){
                dispatch({
                  type: IN_CLASS,
                  payload: {...nextClass, ...classDesc.val(), courseCode: studClass.key, attendanceTaken: true }
                });
                return true;
              }
              else{
                dispatch({
                  type: IN_CLASS,
                  payload: {...nextClass, ...classDesc.val(), courseCode: studClass.key, attendanceTaken: false }
                });
                return true;
              }
          } else {
            dispatch({
              type: IN_CLASS,
              payload: {...nextClass, ...classDesc.val(), courseCode: studClass.key, attendanceTaken: false }
            });
            return true;
          }
        });
    });
    return true;
  }
  //Both action are similar except the status value is to exit the loop as soon as the first occurence is found
}

export const getAttTime = (room, courseCode, criteria, endTime) => {

  //Get current user
  const { currentUser } = Firebase.auth();
  const userAtt = Firebase.database().ref(`users/${currentUser.uid}/att`);

  return(dispatch) => {
    userAtt.once('value', att => {
      startProximityObserver(currentUser, att.val(), room, courseCode, criteria, endTime, dispatch);
    });
  }
}

const startProximityObserver =  (user, att, room, courseCode, criteria, endTime, dispatch) => {
    //Get current date
    const date = new Date().toDateString();
    const userAttRef = Firebase.database().ref(`user_attendances/${courseCode}/${date}/${user.uid}`);

    const zone = new RNEP.ProximityZone(5, room);
    var time = att;
    let timer;
    const userAtt = Firebase.database().ref(`users/${user.uid}/att`);

    //Indicate the user is taking the attendance
    dispatch({
      type: CHECK_LOCATION
    });

    //Action to when user in the zone
    //Start the timer
    zone.onEnterAction = () => {
      console.log("On enter");
      //Set interval for the timer based on the criteria
      timer = BackgroundTimer.setInterval(() => {

        var hour = new Date().getHours();

        //Reason to not use userAtt.set(time).then(...) is due to the instable network connection may caused the attendance to be taken slower than usual
        userAtt.set(time);

        //Action when user successfuly take the attendance
        if(hour < endTime){
          if(time >= criteria){

              //Update the user attendance to the Firebase
              userAttRef.set({
                attendance: true
              }).then(() => {
                //Stop the timer
                BackgroundTimer.clearInterval(timer);

                //Stop observing zones
                RNEP.proximityObserver.stopObservingZones();

                //Action at home screen when user successfully take the attendance
                dispatch({
                  type: CHECK_ATTENDANCE,
                })
              });
          }
        }
        //Action when user failed to exceed the criteria by staying in the class for specific amount of duration
        else {

            //Notify the user the attendance is failed to be taken
            dispatch({
              type: FAILED_ATTENDANCE
            });

            //Stop the timer
            BackgroundTimer.clearInterval(timer);

            //Stop observing zones
            RNEP.proximityObserver.stopObservingZones();

        }

        //Action when student in the zone
        dispatch({
          type: ENTER_CLASS,
          payload: { inClass: true, time: time++ }
        });

      }, 1000);
    };

    //Action when user exit the zone
    //Stop the timer
    zone.onExitAction = () => {
      console.log("On leave");
      BackgroundTimer.clearInterval(timer);
      dispatch({
        type: EXIT_CLASS,
        payload: { inClass: false }
      });
    };

    //Start the location validating
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
};

//To close the modal
export const dismissAttendanceModal = () => {
  return {
    type: DISMISS_MODAL
  };
}

export const toggleBluetoothModal = () => {
  return {
    type: TOGGLE_BLUETOOTH_MODAL
  };
};

export const dismissBluetoothModal = () => {
  return {
    type: DISMISS_BLUETOOTH_MODAL
  };
};
