import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch( process.env.VUE_APP_ALGOLIA_APP_ID, process.env.VUE_APP_ALGOLIA_SEARCH_API_KEY );
const snippetIndex = searchClient.initIndex( 'snippets' );

interface SearchResult {
    pages: number;
    page: number;
    results: any[];
}

export default ( query: string, page: number = 0 ): Promise<SearchResult> => {
    return new Promise( ( resolve, reject ) => {
        snippetIndex
            .search( { query, page } )
            .then( ( result ) => {
                resolve( {
                    pages: result.nbPages,
                    page: result.page,
                    results: result.hits
                } );
            } )
            .catch( ( e ) => {
                reject( e );
            } );
    } );
};
