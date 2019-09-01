<template>
    <div>
        <Nav v-if="isAppReady" :visible="true" :isLoggedIn="isLoggedIn" :onSignOut="onSignOut" />

        <section class="container" v-if="isAppReady">
            <router-view></router-view>
        </section>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Nav from '@/components/Nav';

export default {
    name: 'App',
    components: {
        Nav
    },
    methods: {
        ...mapActions('user', [`signOut`]),
        async onSignOut() {
            await this.signOut();
            this.$router.push('/');
        }
    },
    computed: {
        ...mapState('user', ['isLoggedIn']),
        ...mapState(['isAppReady'])
    }
};
</script>
