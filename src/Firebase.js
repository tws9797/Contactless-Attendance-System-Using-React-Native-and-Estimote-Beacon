import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyAM3PGH7PlZHD457bNen9XZGckwq4XixGg",
  authDomain: "test-52b88.firebaseapp.com",
  databaseURL: "https://test-52b88.firebaseio.com",
  projectId: "test-52b88",
  storageBucket: "test-52b88.appspot.com",
  messagingSenderId: "131743538517",
  appId: "1:131743538517:web:ff704207f140a5a4"
};

const Firebase = firebase.initializeApp(firebaseConfig);

export default Firebase;
