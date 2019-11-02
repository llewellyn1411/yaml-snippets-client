<template>
    <section>
        <div class="auth card">
            <div id="auth-container"></div>
        </div>
    </section>
</template>

<script>
import firebase from '../firebase';
import logEvent from '../utils/logEvent';
import * as firebaseui from 'firebaseui';

const uiConfig = {
    signInSuccessUrl: '/',
    callbacks: {
        signInSuccessWithAuthResult(authResult, redirectUrl) {
            logEvent('login', { method: authResult.credential.signInMethod });
            return true;
        },
        signInFailure(error) {
            logEvent('login_failed', { reason: error });
            return Promise.resolve();
        }
    },
    signInOptions: [
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID
    ]
};

const ui = new firebaseui.auth.AuthUI(firebase.auth());

export default {
    name: 'SignInView',
    mounted() {
        ui.start('#auth-container', uiConfig);
    }
};
</script>
<style lang="scss" scoped>
h1 {
    text-align: center;
}
</style>
