import { Store } from 'vuex';
import Snippet from '../../interfaces/Snippet';
import getUserDetails from '../../functions/getUserDetails';
import getUserSnippets from '../../functions/getUserSnippets';
import getStarredSnippetIds from '../../functions/getStarredSnippetIds';
import snippetsSearch from '../../functions/snippetsSearch';
import snippetCreate from '../../functions/snippetCreate';
import snippetFetch from '../../functions/snippetFetch';
import snippetDelete from '../../functions/snippetDelete';
import snippetUpdate from '../../functions/snippetUpdate';
import snippetAddStar from '../../functions/snippetAddStar';
import snippetRemoveStar from '../../functions/snippetRemoveStar';

interface State {
    snippetsInView?: Snippet[];
    userSnippets?: Snippet[];
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
    userSnippets: undefined,
    snippetQuery: '',
    totalPages: 0,
    currentPage: 0,
    starredSnippetIds: []
};

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
        setUserSnippets( state: State, snippets: Snippet[] ) {
            if ( snippets && snippets.length > 0 ) {
                state.userSnippets = snippets;
            }
        },
        setTotalPages( state: State, totalPages: number ) {
            state.totalPages = totalPages;
        },
        setCurrentPage( state: State, currentPage: number ) {
            state.currentPage = currentPage + 1;
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
        removeUserSnippet( state: State, id: string ) {
            if ( state.userSnippets ) {
                const index = state.userSnippets.findIndex( ( snippet ) => {
                    return snippet.id === id;
                } );

                if ( index !== -1 ) {
                    state.userSnippets.splice( index, 1 );
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
        updateStarredSnippets( state: State, starredSnippetIds: string[] ) {
            state.starredSnippetIds = starredSnippetIds;
        },
        addStar( state: State, snippetId: string ) {
            state.starredSnippetIds.push( snippetId );

            if ( state.snippetsInView ) {
                const starredSnippet = state.snippetsInView.find( ( snippet ) => snippet.id === snippetId );

                if ( starredSnippet ) {
                    starredSnippet.countStar += 1;
                }
            }
        },
        removeStar( state: State, snippetId: string ) {
            const index = state.starredSnippetIds.indexOf( snippetId );
            if ( index !== -1 ) {
                state.starredSnippetIds.splice( index, 1 );
            }

            if ( state.snippetsInView ) {
                const starredSnippet = state.snippetsInView.find( ( snippet ) => snippet.id === snippetId );

                if ( starredSnippet ) {
                    starredSnippet.countStar -= 1;
                }
            }
        }
    },
    actions: {
        loadStarredSnippets( { commit }: Store<State>, uid: string ) {
            return getStarredSnippetIds( uid )
                .then( ( starredSnippetIds ) => {
                    commit( 'updateStarredSnippets', starredSnippetIds );
                } );
        },
        loadSnippets( { commit, state }: Store<State> ) {
            return snippetsSearch( state.snippetQuery )
                .then( ( payload ) => {
                    commit( 'setSnippetsInView', payload.results );
                    commit( 'setTotalPages', payload.pages );
                    commit( 'setCurrentPage', payload.page );
                } );
        },
        loadUserSnippets( { commit, state }: Store<State> ) {
            return getUserSnippets()
                .then( ( payload ) => {
                    commit( 'setUserSnippets', payload );
                } );
        },
        searchSnippets( { commit }: Store<State>, searchPayload: SearchPayload ) {
            const query = searchPayload.query;
            const page = searchPayload.page - 1;
            return snippetsSearch( query, page )
                .then( ( payload ) => {
                    commit( 'setSnippetQuery', query );
                    commit( 'setSnippetsInView', payload.results );
                    commit( 'setTotalPages', payload.pages );
                    commit( 'setCurrentPage', payload.page );
                } );
        },
        loadSnippet( { commit }: Store<State>, id: string ) {
            return snippetFetch( id );
        },
        createSnippet( store: Store<State>, snippet: Snippet ) {
            const currentUser = getUserDetails();
            if ( currentUser ) {
                const { uid, displayName } = currentUser;

                return snippetCreate( {
                    userDisplayName: displayName || '',
                    userId: uid,
                    name: snippet.name,
                    description: snippet.description,
                    content: snippet.content
                } );
            }
        },
        removeSnippet( { commit }: Store<State>, id: string ) {
            return snippetDelete( id )
                .then( () => {
                    commit( 'removeSnippetFromList', id );
                    commit( 'removeUserSnippet', id );
                } );
        },
        updateSnippet( { commit }: Store<State>, snippet: Snippet ) {
            if ( snippet && snippet.id ) {
                return snippetUpdate( snippet.id, {
                    name: snippet.name,
                    content: snippet.content,
                    description: snippet.description
                } ).then( () => {
                    commit( 'updateSnippet', snippet );
                } );
            }
        },
        addStar( { commit }: Store<State>, payload: EditStarPayload ) {
            const { userId, snippetId } = payload;
            return snippetAddStar( userId, snippetId )
                .then( () => {
                    commit( 'addStar', snippetId );
                } );
        },
        removeStar( { commit }: Store<State>, payload: EditStarPayload ) {
            const { userId, snippetId } = payload;
            return snippetRemoveStar( userId, snippetId )
                .then( () => {
                    commit( 'removeStar', snippetId );
                } );
        }
    },
    getters: {
        snippetsInView( state: State ) {
            return state.snippetsInView;
        },
        userSnippets( state: State ) {
            return state.userSnippets;
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
