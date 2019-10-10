import firebase from 'firebase/app';
import logEvent from '../utils/logEvent';

export default ( snippetId: string ) => {
    logEvent( 'snippet_fetch_attempt', { id: snippetId } );
    return firebase.firestore().collection( 'snippets' ).doc( snippetId ).get()
        .then( ( doc ) => {
            logEvent( 'snippet_fetch_success', { id: snippetId } );
            const data = doc.data();

            const payload = {
                id: doc.id,
                ...data
            };

            return payload;
        } );
};
