import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';
import firebase from './firebase';
import App from './App.vue';
import router from './router';
import store from './store/index';

import './registerServiceWorker';
import 'firebaseui/dist/firebaseui.css';
import 'prismjs/themes/prism-funky.css';
import './assets/styles/main.scss';

Vue.use( VueClipboard );

new Vue( {
    router,
    store,
    render: ( h ) => h( App ),
    created() {
        firebase.auth().onAuthStateChanged( ( user ) => {
            if ( user ) {
                this.$store.dispatch( 'user/setUserLoggedInStatus', true );
                this.$store.dispatch( 'user/setUserName', user.displayName );
                this.$store.dispatch( 'user/setUserEmail', user.email );
                this.$store.dispatch( 'user/setUserId', user.uid );
                this.$store.dispatch( 'snippets/loadStarredSnippets', user.uid );
            } else {
                this.$store.dispatch( 'user/setUserLoggedInStatus', false );
            }

            this.$store.dispatch( 'setReadyState', true );
        } );
    }
} ).$mount( '#app' );
