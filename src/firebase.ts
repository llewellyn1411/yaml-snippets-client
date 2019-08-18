import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    authDomain: 'yaml-snippets.firebaseapp.com',
    databaseURL: 'https://yaml-snippets.firebaseio.com',
    projectId: 'yaml-snippets',
    storageBucket: 'yaml-snippets.appspot.com',
    messagingSenderId: '453591703203',
    appId: process.env.VUE_APP_FIREBASE_APP_ID
};

firebase.initializeApp( firebaseConfig );

export default firebase;
