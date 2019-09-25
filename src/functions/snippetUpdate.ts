import validate from 'validate.js';
import firebase from 'firebase/app';

interface UpdateSnippetPayload {
    name: string;
    content: string;
    description: string;
}

const constraints = {
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

export default ( snippetId: string, payload: UpdateSnippetPayload ) => {
    const validationErrors = validate( payload, constraints, { format: 'flat' } );

    if ( validationErrors ) {
        return Promise.reject( validationErrors[ 0 ] );
    }

    return firebase.firestore().collection( 'snippets' ).doc( snippetId ).update( {
        name: payload.name,
        content: payload.content,
        description: payload.description
    } );
};
