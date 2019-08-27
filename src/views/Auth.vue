<template>
    <div class="auth">
        <div id="auth-container"></div>
    </div>
</template>

<script>
import firebase from '../firebase';
import * as firebaseui from 'firebaseui';

const uiConfig = {
    signInSuccessUrl: '/',
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID]
};

const ui = new firebaseui.auth.AuthUI(firebase.auth());

export default {
    name: 'Auth',
    mounted() {
        ui.start('#auth-container', uiConfig);
    }
};
</script>
