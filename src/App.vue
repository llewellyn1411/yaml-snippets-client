<template>
    <div>
        <Nav v-if="isAppReady" :visible="true" :isLoggedIn="isLoggedIn" :onSignOut="onSignOut" />

        <section class="container" v-if="isAppReady">
            <router-view></router-view>
        </section>

        <Toast
            v-model="notification"
            :visible="notification.isActive"
            :title="notification.title"
            :message="notification.message"
            :type="notification.type"
            :onClose="hideNotification"
        />
    </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import Nav from '@/components/Nav';
import Toast from '@/components/Toast';

export default {
    name: 'App',
    components: {
        Nav,
        Toast
    },
    methods: {
        ...mapActions('user', [`signOut`]),
        ...mapActions('notification', ['hideNotification']),
        async onSignOut() {
            await this.signOut();
            this.$router.push('/');
        }
    },
    computed: {
        ...mapGetters('notification', ['notification']),
        ...mapState('user', ['isLoggedIn']),
        ...mapState(['isAppReady'])
    }
};
</script>
