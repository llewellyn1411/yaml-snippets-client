import firebase from 'firebase/app';
import algoliasearch from 'algoliasearch/lite';
import { Store } from 'vuex';
import Snippet from '../../interfaces/Snippet';

interface State {
    snippetsInView?: Snippet[];
    snippetQuery: string;
    totalPages: number;
    currentPage: number;
    starredSnippetIds: string[];
}

interface EditStarPayload {
    userId: string;
    snippetId: string;
}

interface SearchPayload {
    query: string;
    page: number;
}

const defaultState: State = {
    snippetsInView: undefined,
    snippetQuery: '',
    totalPages: 0,
    currentPage: 0,
    starredSnippetIds: []
};

const increment = firebase.firestore.FieldValue.increment( 1 );

const searchClient = algoliasearch( process.env.VUE_APP_ALGOLIA_APP_ID, process.env.VUE_APP_ALGOLIA_SEARCH_API_KEY );
const snippetIndex = searchClient.initIndex( 'snippets' );

export default {
    namespaced: true,
    state: defaultState,
    mutations: {
        setSnippetQuery( state: State, query: string ) {
            state.snippetQuery = query;
        },
        setSnippetsInView( state: State, newSnippets: Snippet[] ) {
            state.snippetsInView = newSnippets;
        },
        setTotalPages( state: State, totalPages: number ) {
            state.totalPages = totalPages;
        },
        setCurrentPage( state: State, currentPage: number ) {
            state.currentPage = currentPage + 1;
        },
        appendSnippetToList( state: State, snippet: Snippet ) {
            if ( state.snippetsInView && snippet ) {
                state.snippetsInView.push( snippet );
            }
        },
        removeSnippetFromList( state: State, id: string ) {
            if ( state.snippetsInView ) {
                const index = state.snippetsInView.findIndex( ( snippet ) => {
                    return snippet.id === id;
                } );

                if ( index !== -1 ) {
                    state.snippetsInView.splice( index, 1 );
                }
            }
        },
        updateSnippet( state: State, targetSnippet: Snippet ) {
            if ( state.snippetsInView ) {
                const index = state.snippetsInView.findIndex( ( snippet ) => {
                    return snippet.id === targetSnippet.id;
                } );

                const oldSnippet = state.snippetsInView[ index ];
                if ( oldSnippet ) {
                    state.snippetsInView[ index ] = Object.assign( oldSnippet, targetSnippet );
                }
            }
        },
        incrementSnippetCopies( state: State, id: string ) {
            if ( state.snippetsInView ) {
                const index = state.snippetsInView.findIndex( ( snippet ) => {
                    return snippet.id === id;
                } );

                if ( state.snippetsInView[ index ] ) {
                    state.snippetsInView[ index ].countCopy++;
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
        loadSnippets( { commit, state }: Store<State> ) {
            return snippetIndex.search( { query: state.snippetQuery } ).then( ( result ) => {
                commit( 'setSnippetsInView', result.hits );
                commit( 'setTotalPages', result.nbPages );
                commit( 'setCurrentPage', result.page );
            } );
        },
        searchSnippets( { commit }: Store<State>, searchPayload: SearchPayload ) {
            const query = searchPayload.query;
            const page = searchPayload.page - 1;
            return snippetIndex.search( { query, page } ).then( ( result ) => {
                commit( 'setSnippetQuery', query );
                commit( 'setSnippetsInView', result.hits );
                commit( 'setTotalPages', result.nbPages );
                commit( 'setCurrentPage', result.page );
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
        snippetsInView( state: State ) {
            return state.snippetsInView;
        },
        snippetQuery( state: State ) {
            return state.snippetQuery;
        },
        starredSnippetIds( state: State ) {
            return state.starredSnippetIds;
        },
        totalPages( state: State ) {
            return state.totalPages;
        },
        currentPage( state: State ) {
            return state.currentPage;
        }
    }
};
