<template>
    <div>
        <Nav :isAppReady="isAppReady" :visible="true" :isLoggedIn="isLoggedIn" :onSignOut="onSignOut" />

        <section class="container">
            <LoadingIcon :visible="!isAppReady" />
            <router-view v-if="isAppReady"></router-view>
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
import LoadingIcon from '@/components/LoadingIcon';

export default {
    name: 'App',
    components: {
        Nav,
        Toast,
        LoadingIcon
    },
    methods: {
        ...mapActions('user', [`signOut`]),
        ...mapActions('notification', ['hideNotification']),
        async onSignOut() {
            await this.signOut();
            this.$router.push({ name: 'explore' });
        }
    },
    computed: {
        ...mapGetters('notification', ['notification']),
        ...mapState('user', ['isLoggedIn']),
        ...mapState(['isAppReady'])
    }
};
</script>
