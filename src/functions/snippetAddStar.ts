import firebase from 'firebase/app';

export default ( userId: string, snippetId: string ) => {
    return firebase.firestore().collection( 'stars' ).doc( `${ userId }_${ snippetId }` ).set( {
        userId,
        snippetId
    } );
};
