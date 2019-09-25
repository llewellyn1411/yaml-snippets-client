import firebase from 'firebase/app';

export default ( userId: string ) => {
    return new Promise( ( resolve, reject ) => {
        firebase
            .firestore()
            .collection( 'stars' )
            .where( 'userId', '==', userId )
            .get()
            .then( ( querySnapShot ) => {
                const starredSnippetIds = querySnapShot.docs.map( ( doc ) => doc.data().snippetId );
                resolve( starredSnippetIds );
            } )
            .catch( ( e ) => {
                reject( e );
            } );
    } );
};
