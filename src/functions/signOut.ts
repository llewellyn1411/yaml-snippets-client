import firebase from 'firebase/app';
import logEvent from '../utils/logEvent';

export default () => {
    logEvent( 'signout' );
    return firebase.auth().signOut();
};
