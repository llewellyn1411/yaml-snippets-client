import firebase from 'firebase/app';

export default ( snippetId: string ) => {
    return firebase.firestore().collection( 'snippets' ).doc( snippetId ).delete();
};
