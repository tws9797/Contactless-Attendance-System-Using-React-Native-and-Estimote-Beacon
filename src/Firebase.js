import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyCyaliBdovUQCOXVcNaG1QOzRWFc12XOoU",
  authDomain: "attendance-cbddc.firebaseapp.com",
  databaseURL: "https://attendance-cbddc.firebaseio.com",
  projectId: "attendance-cbddc",
  storageBucket: "",
  messagingSenderId: "139915211560",
  appId: "1:139915211560:web:427423d6d50b0a71"
};

const Firebase = firebase.initializeApp(firebaseConfig);

export default Firebase;
