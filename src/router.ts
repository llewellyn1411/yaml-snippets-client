import Vue from 'vue';
import Router from 'vue-router';
import firebase from './firebase';
import HomeView from './views/HomeView.vue';
import SignInView from './views/SignInView.vue';

Vue.use( Router );

const isUserLoggedIn = ( to: object, from: object, next: ( ...args: any[] ) => void ) => {
  firebase.auth().onAuthStateChanged( ( user ) => {
    if ( user ) {
      next();
    } else {
      next( false );
    }
  } );
};

export default new Router( {
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'explore',
      component: HomeView
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignInView
    },
    {
      path: '/snippet/create',
      name: 'snippet-create',
      component: () => import( './views/SnippetCreateView.vue' ),
      beforeEnter: isUserLoggedIn
    },
    {
      path: '/snippet/:id',
      name: 'snippet-customise',
      component: () => import( './views/SnippetCustomiseView.vue' )
    },
    {
      path: '/snippet/edit/:id',
      name: 'snippet-edit',
      component: () => import( './views/SnippetEditView.vue' ),
      beforeEnter: isUserLoggedIn
    },
    {
      path: '/account',
      name: 'account',
      component: () => import( './views/AccountView.vue' ),
      beforeEnter: isUserLoggedIn
    },
    {
      path: '/*',
      component: HomeView
    }
  ]
} );
