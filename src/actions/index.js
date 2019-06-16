import {
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER,
  GET_USER
} from './types.js';
import Firebase from '../Firebase';

export const emailChanged = (text) => {
  return {
      type: EMAIL_CHANGED,
      payload: text
  };
};

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

    Firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => checkUserDeviceId(dispatch, user, navigation))
      .catch(() => loginUserFail(dispatch));
  };
};

export const getUserToken = (navigation) => {
  return (dispatch) =>
    Firebase.auth().onAuthStateChanged((user) => {
      if(user){
        checkUserDeviceId(dispatch, user, navigation);
      }
      else{
        navigation.navigate('Auth');
      }
    });
}

const loginUserSuccess = (dispatch, user, navigation) => {
  dispatch({
      type: LOGIN_USER_SUCCESS,
      payload: user
  });
  navigation.navigate('App');
}

const loginUserFail = (dispatch) => {
  dispatch({
    type: LOGIN_USER_FAIL
  });
}

const checkUserDeviceId = (dispatch, user, navigation) => {
  return(dispatch) => {
    Firebase.database().ref(`users/${user.uid}/deviceId`)
    .on('value', snapshot => {
      if(snapshot.val() === DeviceInfo.getUniqueID())
        loginUserSuccess(dispatch, user, navigation);
      else
        loginUserFail(dispatch);
    });
  };
}
