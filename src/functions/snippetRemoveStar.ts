import firebase from 'firebase/app';
import logEvent from '../utils/logEvent';

export default ( userId: string, snippetId: string ) => {
    logEvent( 'snippet_remove_star', {
        userId,
        snippetId
    } );
    return firebase.firestore().collection( 'stars' ).doc( `${ userId }_${ snippetId }` ).delete();
};
