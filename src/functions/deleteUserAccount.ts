import firebase from 'firebase/app';

const deleteUser = firebase.functions().httpsCallable( 'deleteUser' );

export default () => {
    return new Promise( ( resolve, reject ) => {
        deleteUser()
            .then( () => {
                resolve();
            } ).catch( () => {
                reject();
            } );
    } );
};
