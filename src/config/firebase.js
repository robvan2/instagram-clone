import firebase from 'firebase'
const firebaseConfig = {
    apiKey: "AIzaSyB0tdSRdIfPTZUGjiUfRqX5dITV7ugjGcQ",
    authDomain: "instagram-clone-21b16.firebaseapp.com",
    databaseURL: "https://instagram-clone-21b16.firebaseio.com",
    projectId: "instagram-clone-21b16",
    storageBucket: "instagram-clone-21b16.appspot.com",
    messagingSenderId: "40518249836",
    appId: "1:40518249836:web:f5919b0a2fb33b96e15749",
    measurementId: "G-1X83N1PZQG"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage }