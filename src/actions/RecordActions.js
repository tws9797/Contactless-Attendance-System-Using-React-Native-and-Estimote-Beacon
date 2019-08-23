import {
  GET_USER_CLASSES,
  LOAD_RECORDS,
  GET_USER_NAME
} from './types.js';
import Firebase from '../Firebase';

export const getUserName = () => {
  const { currentUser } = Firebase.auth();

  return(dispatch) => {
    Firebase.database().ref(`users/${currentUser.uid}`)
      .on('value', snapshot => {
        dispatch({ type: GET_USER_NAME, payload: snapshot.val() });
      });
  }
}

export const getUserClass = () => {

  const { currentUser } = Firebase.auth();

  const userClassRef = Firebase.database().ref('stud_enrollments');

  return(dispatch) => {

    dispatch({
      type: LOAD_RECORDS
    });

    var records = new Array();

    Firebase.database().ref(`stud_enrollments/${currentUser.uid}`)
      .once('value').then(snapshot => {
        if(snapshot.exists()){

          for(let prop in snapshot.val()){
            records = records.concat(Object.keys(snapshot.val()[prop]));
          }
          records = [...new Set(records)];
        }
      }).then(() => {
        var newRecords = new Array();
        Firebase.database().ref('user_attendances')
          .once('value', snapshot => {
            if(snapshot.exists()){
              Firebase.database().ref('classes')
                .once('value').then(classDesc => {
                  for(let record in records){
                    let newRecord = {
                      course: records[record],
                      attendance : snapshot.child(records[record]).val(),
                      desc: classDesc.child(records[record]).val().desc,
                    }
                    newRecords.push(newRecord);
                  }
                }).then(() => {
                  dispatch({
                    type: GET_USER_CLASSES,
                    payload: {newRecords}
                  });
                });
            }
          });
      });
  }

}
