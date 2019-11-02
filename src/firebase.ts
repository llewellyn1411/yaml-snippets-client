import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/messaging';
import 'firebase/analytics';
import 'firebase/performance';
import 'firebase/remote-config';

firebase.initializeApp( {
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGE_SENDER_ID,
    appId: process.env.VUE_APP_FIREBASE_APP_ID,
    measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
} );

export const messaging = firebase.messaging();
export const analytics = firebase.analytics();
export const performance = firebase.performance();
export const remoteConfig = firebase.remoteConfig();

remoteConfig.settings = {
    minimumFetchIntervalMillis: 3600000,
    fetchTimeoutMillis: 3600000
};

remoteConfig.defaultConfig = ( {
    web_notifications: false
} );

remoteConfig.fetchAndActivate().then( () => {
    const webNotifications = remoteConfig.getBoolean( 'web_notifications' );

    if ( webNotifications ) {
        messaging.requestPermission().then( async () => {
            const token = await messaging.getToken();
        } );
    }
} );

export default firebase;
