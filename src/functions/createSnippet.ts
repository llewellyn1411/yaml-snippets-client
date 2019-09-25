import validate from 'validate.js';
import firebase from 'firebase/app';

interface CreateSnippetPayload {
    userId: string;
    userDisplayName: string;
    name: string;
    content: string;
    description: string;
}

const constraints = {
    userId: {
        presence: {
            allowEmpty: false
        },
        type: 'string'
    },
    userDisplayName: {
        presence: {
            allowEmpty: false
        },
        type: 'string'
    },
    name: {
        presence: {
            allowEmpty: false
        },
        type: 'string',
        length: {
            minimum: 5,
            maximum: 20,
            tooShort: 'Snippet name should not be shorter than 5 characters',
            tooLong: 'Snippet name should not be longer than 20 characters'
        }
    },
    description: {
        presence: {
            allowEmpty: false
        },
        type: 'string',
        length: {
            minimum: 10,
            maximum: 500,
            tooShort: 'Snippet description should not be shorter than 10 characters',
            tooLong: 'Snippet description should not be longer than 500 characters'
        }
    },
    content: {
        presence: {
            allowEmpty: false
        },
        type: 'string',
        length: {
            minimum: 5,
            maximum: 1000,
            tooShort: 'Snippet content should not be shorter than 5 characters',
            tooLong: 'Snippet content should not be longer than 1000 characters'
        }
    }
};

export default ( payload: CreateSnippetPayload ) => {
    return new Promise( ( resolve, reject ) => {
        const validationErrors = validate( payload, constraints, { format: 'flat' } );

        if ( validationErrors ) {
            reject( validationErrors[ 0 ] );
        }

        firebase.firestore().collection( 'snippets' )
            .add( {
                name: payload.name,
                description: payload.description,
                content: payload.content,
                author: {
                    uid: payload.userId,
                    displayName: payload.userDisplayName
                }
            } )
            .then( ( doc ) => doc.get() )
            .then( ( doc ) => {
                resolve( {
                    id: doc.id,
                    ...doc.data()
                } );
            } )
            .catch( ( e ) => {
                reject( 'Failed to create snippet' );
            } );
    } );
};
