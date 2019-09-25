import firebase from 'firebase/app';

export default ( snippetId: string ) => {
    return firebase.firestore().collection( 'snippets' ).doc( snippetId ).get()
        .then( ( doc ) => {
            const data = doc.data();

            const payload = {
                id: doc.id,
                ...data
            };

            return payload;
        } );
};
