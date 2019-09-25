import { Store } from 'vuex';

interface State {
    isActive: boolean;
    title: string;
    message: string;
    type: string;
}

interface Notification {
    title: string;
    message: string;
    type: string;
}

const defaultState: State = {
    isActive: false,
    title: '',
    message: '',
    type: ''
};

export default {
    namespaced: true,
    state: defaultState,
    mutations: {
        setActiveState( state: State, isActive: boolean ) {
            state.isActive = isActive;
        },
        setTitle( state: State, title: string ) {
            state.title = title;
        },
        setMessage( state: State, message: string ) {
            state.message = message;
        },
        setType( state: State, type: string ) {
            state.type = type;
        }
    },
    actions: {
        showNotification( { commit, dispatch }: Store<State>, notificationPayload: Notification ) {
            commit( 'setActiveState', true );
            commit( 'setTitle', notificationPayload.title );
            commit( 'setMessage', notificationPayload.message );
            commit( 'setType', notificationPayload.type );

            setTimeout( () => {
                dispatch( 'hideNotification' );
            }, 2000 );
        },
        hideNotification( { commit }: Store<State> ) {
            commit( 'setActiveState', false );
            commit( 'setTitle', '' );
            commit( 'setMessage', '' );
            commit( 'setType', '' );
        }
    },
    getters: {
        notification( state: State ) {
            return {
                isActive: state.isActive,
                title: state.title,
                message: state.message,
                type: state.type
            };
        }
    }
};
