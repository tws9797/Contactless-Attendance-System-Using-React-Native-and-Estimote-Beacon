import {
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER,
  GET_USER_ID
} from './types.js';
import Firebase from '../Firebase';
import DeviceInfo from 'react-native-device-info';

//Handle the changes in LoginForm input for email
export const emailChanged = (text) => {
  return {
      type: EMAIL_CHANGED,
      payload: text
  };
};

//Handle the changes in LoginForm input for password
export const passwordChanged = (text) => {
  return {
    type: PASSWORD_CHANGED,
    payload: text
  };
};

export const loginUser = ({ email, password, navigation }) => {
  //Action creator return a function
  //Redux thunk calls it with dispatch when a function is returned
  //Redux thunk dispatch an action to perform asynchronous process
  //Dispatch is a method
  return (dispatch) => {
    dispatch({ type: LOGIN_USER });

    //Sign the user with the email and password provided
    Firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => loginUserSuccess(dispatch, user, navigation))
      .catch(() => loginUserFail(dispatch));
  };
};

//Persistant login (if the application is not uninstall or clear data)
export const getUserToken = (navigation) => {
  return (dispatch) =>{
    //The user status will changed to null if user uninstall or clear data of the applcation
    Firebase.auth().onAuthStateChanged((user) => {
      //If user is logged in
      //compare the deviceId of the user in Firebase with the deviceId of the currently used device
      if(user){
        loginUserSuccess(dispatch, user, navigation);
      }
      //If user is not logged in
      //Navigate to the auth screen
      else{
        navigation.navigate('Auth');
      }
    });
  }
}

//Actions when user successfully login
const loginUserSuccess = (dispatch, user, navigation) => {
  dispatch({
      type: LOGIN_USER_SUCCESS,
      payload: user
  });
  navigation.navigate('App');
}

//Actions when user failed to login
const loginUserFail = (dispatch) => {
  dispatch({
    type: LOGIN_USER_FAIL
  });
}

const checkUserDeviceId = (dispatch, user, navigation) => {
  //Get deviceId that have been previously set
  Firebase.database().ref(`users/${user.uid}/deviceId`)
  .on('value', snapshot => {
    if(snapshot.val() === DeviceInfo.getUniqueID())
      loginUserSuccess(dispatch, user, navigation);
    else{
        //Sign out to triggered onAuthStateChanged so that user === null
        Firebase.auth().signOut().then(() => {
        loginUserFail(dispatch);
      });
    }
  });
}
