import Vue from 'vue';
import Router from 'vue-router';
import HomeView from './views/HomeView.vue';
import SignInView from './views/SignInView.vue';
import store from './store/index';

Vue.use( Router );

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
      beforeEnter: ( to, from, next ) => {
        if ( store.getters[ 'user/isUserLoggedIn' ] ) {
          next();
        }

        next( false );
      }
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
      beforeEnter: ( to, from, next ) => {
        if ( store.getters[ 'user/isUserLoggedIn' ] ) {
          next();
        }

        next( false );
      }
    },
    {
      path: '/*',
      component: HomeView
    }
  ]
} );
