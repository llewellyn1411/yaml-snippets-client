import firebase from 'firebase/app';
import { Store } from 'vuex';
import Snippet from '../../interfaces/Snippet';

interface State {
    snippetList?: Snippet[];
    starredSnippetIds: string[];
}

interface EditStarPayload {
    userId: string;
    snippetId: string;
}

const defaultState: State = {
    snippetList: undefined,
    starredSnippetIds: []
};

const increment = firebase.firestore.FieldValue.increment( 1 );

export default {
    namespaced: true,
    state: defaultState,
    mutations: {
        updateSnippets( state: State, newSnippets: Snippet[] ) {
            state.snippetList = newSnippets;
        },
        appendSnippetToList( state: State, snippet: Snippet ) {
            if ( state.snippetList && snippet ) {
                state.snippetList.push( snippet );
            }
        },
        removeSnippetFromList( state: State, id: string ) {
            if ( state.snippetList ) {
                const index = state.snippetList.findIndex( ( snippet ) => {
                    return snippet.id === id;
                } );

                if ( index !== -1 ) {
                    state.snippetList.splice( index, 1 );
                }
            }
        },
        updateSnippet( state: State, targetSnippet: Snippet ) {
            if ( state.snippetList ) {
                const index = state.snippetList.findIndex( ( snippet ) => {
                    return snippet.id === targetSnippet.id;
                } );

                const oldSnippet = state.snippetList[ index ];
                if ( oldSnippet ) {
                    state.snippetList[ index ] = Object.assign( oldSnippet, targetSnippet );
                }
            }
        },
        incrementSnippetCopies( state: State, id: string ) {
            if ( state.snippetList ) {
                const index = state.snippetList.findIndex( ( snippet ) => {
                    return snippet.id === id;
                } );

                if ( state.snippetList[ index ] ) {
                    state.snippetList[ index ].countCopy++;
                }
            }
        },
        updateStarredSnippets( state: State, starredSnippetIds: string[] ) {
            state.starredSnippetIds = starredSnippetIds;
        },
        addStar( state: State, snippetId: string ) {
            state.starredSnippetIds.push( snippetId );
        },
        removeStar( state: State, snippetId: string ) {
            const index = state.starredSnippetIds.indexOf( snippetId );
            if ( index !== -1 ) {
                state.starredSnippetIds.splice( index, 1 );
            }
        }
    },
    actions: {
        loadStarredSnippets( { commit }: Store<State>, uid: string ) {
            return firebase.firestore().collection( 'stars' )
                .where( 'userId', '==', uid ).get()
                .then( ( querySnapShot ) => {
                    const starredSnippetIds = querySnapShot.docs.map( ( doc ) => doc.data().snippetId );
                    commit( 'updateStarredSnippets', starredSnippetIds );
                } );
        },
        loadSnippets( { commit }: Store<State> ) {
            return firebase.firestore().collection( 'snippets' ).limit( 10 ).get()
                .then( ( querySnapShot ) => {
                    const payload = querySnapShot.docs.map( ( doc ) => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            ...data
                        };
                    } );

                    commit( 'updateSnippets', payload );
                } );
        },
        loadSnippet( { commit }: Store<State>, id: string ) {
            return firebase.firestore().collection( 'snippets' ).doc( id ).get()
                .then( ( doc ) => {
                    const data = doc.data();

                    const payload = {
                        id: doc.id,
                        ...data
                    };

                    return payload;
                } );
        },
        createSnippet( { commit }: Store<State>, snippet: Snippet ) {
            // TODO: Validate
            const currentUser = firebase.auth().currentUser;
            const uid = currentUser!.uid;
            const displayName = currentUser!.displayName;

            return firebase.firestore().collection( 'snippets' ).add( {
                ...snippet,
                author: {
                    uid,
                    displayName
                }
            } ).then( ( doc ) => {
                return doc.get();
            } ).then( ( doc ) => {
                const payload: Snippet = {
                    id: doc.id,
                    name: snippet.name,
                    content: snippet.content,
                    description: snippet.description,
                    tags: snippet.tags,
                    countCopy: snippet.countCopy,
                    countStar: snippet.countStar,
                    author: {
                        uid,
                        displayName
                    }
                };

                commit( 'appendSnippetToList', payload );
            } );
        },
        removeSnippet( { commit }: Store<State>, id: string ) {
            return firebase.firestore().collection( 'snippets' ).doc( id ).delete()
                .then( () => {
                    commit( 'removeSnippetFromList', id );
                } );
        },
        updateSnippet( { commit }: Store<State>, snippet: Snippet ) {
            // TODO: Validate
            return firebase.firestore().collection( 'snippets' ).doc( snippet.id ).update( {
                name: snippet.name,
                content: snippet.content,
                description: snippet.description
            } ).then( () => {
                commit( 'updateSnippet', snippet );
            } );
        },
        incrementSnippetCopies( { commit }: Store<State>, snippetId: string ) {
            return firebase.firestore().collection( 'snippets' ).doc( snippetId )
                .update( { countCopy: increment } ).then( () => {
                    commit( 'incrementSnippetCopies', snippetId );
                } );
        },
        addStar( { commit }: Store<State>, payload: EditStarPayload ) {
            const { userId, snippetId } = payload;
            return firebase.firestore().collection( 'stars' ).doc( `${ userId }_${ snippetId }` ).set( {
                userId,
                snippetId
            } ).then( () => {
                commit( 'addStar', snippetId );
            } );
        },
        removeStar( { commit }: Store<State>, payload: EditStarPayload ) {
            const { userId, snippetId } = payload;
            return firebase.firestore().collection( 'stars' ).doc( `${ userId }_${ snippetId }` ).delete().then( () => {
                commit( 'removeStar', snippetId );
            } );
        }
    },
    getters: {
        snippetList( state: State ) {
            return state.snippetList;
        },
        starredSnippetIds( state: State ) {
            return state.starredSnippetIds;
        }
    }
};
