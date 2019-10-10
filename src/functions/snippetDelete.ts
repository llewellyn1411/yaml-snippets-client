import firebase from 'firebase/app';
import logEvent from '../utils/logEvent';

export default ( snippetId: string ) => {
    logEvent( 'snippet_delete', { id: snippetId } );
    return firebase.firestore().collection( 'snippets' ).doc( snippetId ).delete();
};
