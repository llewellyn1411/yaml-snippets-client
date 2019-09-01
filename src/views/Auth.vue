<template>
    <div class="auth">
        <h1>Welcome</h1>
        <div id="auth-container"></div>
    </div>
</template>

<script>
import firebase from '../firebase';
import * as firebaseui from 'firebaseui';

const uiConfig = {
    signInSuccessUrl: '/',
    signInOptions: [
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID
    ]
};

const ui = new firebaseui.auth.AuthUI(firebase.auth());

export default {
    name: 'Auth',
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
