import firebase from 'firebase/app';

export default () => {
    return firebase.auth().signOut();
};
