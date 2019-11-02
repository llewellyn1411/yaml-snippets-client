import firebase from 'firebase/app';

export default () => {
    return new Promise( ( resolve, reject ) => {
        const currentUser = firebase.auth().currentUser;

        if ( currentUser ) {
            const uid = currentUser.uid;

            firebase
                .firestore()
                .collection( 'snippets' )
                .where( 'author.uid', '==', uid )
                .get()
                .then( ( querySnapShot ) => {
                    const snippets = querySnapShot.docs.map( ( doc ) => {
                        return { id: doc.id, ...doc.data() };
                    } );
                    resolve( snippets );
                } )
                .catch( ( e ) => {
                    reject( e );
                } );
        } else {
            reject( 'User not logged in' );
        }
    } );
};
