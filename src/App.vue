<template>
    <v-app>
        <Nav v-if="ready" :visible="true" :isLoggedIn="isLoggedIn" :onSignOut="onSignOut" />
        <v-content>
            <v-container v-if="ready">
                <router-view></router-view>
            </v-container>
        </v-content>
    </v-app>
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
            this.$router.push('/auth');
        }
    },
    computed: {
        ...mapState('user', ['isLoggedIn']),
        ...mapState(['ready'])
    }
};
</script>
