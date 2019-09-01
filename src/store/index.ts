import Vue from 'vue';
import Vuex, { StoreOptions, ModuleTree } from 'vuex';
import snippets from './modules/snippets';
import user from './modules/user';

Vue.use( Vuex );
interface State {
  version?: string;
  isAppReady: boolean;
}

const defaultState: State = {
  version: '0.1.0',
  isAppReady: false
};

const modules: any = {
  snippets,
  user
};

const store: StoreOptions<State> = {
  state: defaultState,
  mutations: {
    setReadyState( state, isReady: boolean ) {
      state.isAppReady = isReady;
    }
  },
  actions: {
    setReadyState( { commit }, isReady: boolean ) {
      commit( 'setReadyState', isReady );
    }
  },
  getters: {
    ready( state ) {
      return state.isAppReady;
    }
  },
  modules
};

export default new Vuex.Store( store );
