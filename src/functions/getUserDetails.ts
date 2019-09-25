import firebase from 'firebase/app';

export default () => {
    const currentUser = firebase.auth().currentUser;

    if ( currentUser ) {
        return {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            email: currentUser.email
        };
    }

    return null;
};
