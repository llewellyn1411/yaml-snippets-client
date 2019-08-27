import Vue from 'vue';
import Vuex, { StoreOptions, ModuleTree } from 'vuex';
import snippets from './modules/snippets';
import user from './modules/user';

Vue.use( Vuex );
interface State {
  version?: string;
  ready: boolean;
}

const defaultState: State = {
  version: '0.1.0',
  ready: false
};

const modules: any = {
  snippets,
  user
};

const store: StoreOptions<State> = {
  state: defaultState,
  mutations: {
    setReadyState( state, isReady: boolean ) {
      state.ready = isReady;
    }
  },
  actions: {
    setReadyState( { commit }, isReady: boolean ) {
      commit( 'setReadyState', isReady );
    },
    setLoadingState( { commit }, isLoading: boolean ) {
      commit( 'setLoadingState', isLoading );
    }
  },
  getters: {
    ready( state ) {
      return state.ready;
    }
  },
  modules
};

export default new Vuex.Store( store );
