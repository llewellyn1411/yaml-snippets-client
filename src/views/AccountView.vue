<template>
    <div class="page account" id="account-view">
        <LoadingIcon :visible="!userDetails" />
        <div class="card" v-if="userDetails">
            <div class="card-header">
                <div class="card-title h5">{{ userDetails.name }}</div>
                <div class="card-subtitle text-gray">{{ userDetails.email }}</div>
            </div>
            <div class="card-body">
                <button class="btn btn-primary" :class="{ loading: isAccountDeleted }" @click="shoModal">Delete Account</button>
            </div>
            <div class="card-footer" v-if="userSnippets">
                <h4>Snippets</h4>
                <SnippetList :snippets="userSnippets" :uid="userDetails.id" :isLoggedIn="true" />
            </div>
        </div>
        <div class="modal" :class="{ active: isConfirmationRequired }">
            <div class="modal-overlay" aria-label="Close"></div>
            <div class="modal-container">
                <div class="modal-header">
                    <div class="modal-title h5">Are you sure you want to delete your account?</div>
                </div>
                <div class="modal-footer">
                    <div class="btn-group btn-group-block">
                        <button class="btn btn-primary" :class="{ loading: isAccountDeleted }" @click="deleteUserAccount">Yes</button>
                        <button class="btn btn-error" :class="{ disabled: isAccountDeleted }" @click="dismissModal">No</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import LoadingIcon from '@/components/LoadingIcon';
import SnippetList from '@/components/SnippetList';

export default {
    name: 'AccountView',
    components: {
        LoadingIcon,
        SnippetList
    },
    data() {
        return {
            isAccountDeleted: false,
            isConfirmationRequired: false,
            isDeletionConfirmed: false
        };
    },
    computed: {
        ...mapGetters('user', ['userDetails']),
        ...mapGetters('snippets', ['userSnippets'])
    },
    methods: {
        ...mapActions('snippets', ['loadUserSnippets']),
        ...mapActions('notification', ['showNotification']),
        ...mapActions('user', ['deleteUser']),
        deleteUserAccount() {
            if (this.isConfirmationRequired) {
                this.isAccountDeleted = true;
                this.deleteUser()
                    .then(() => {
                        this.$router.push({ name: 'explore' });
                    })
                    .catch(() => {
                        this.showNotification({
                            title: 'Error',
                            message: 'Unable to delete account',
                            type: 'error'
                        });
                    });
            }
        },
        shoModal() {
            this.isConfirmationRequired = true;
        },
        dismissModal() {
            this.isConfirmationRequired = false;
        }
    },
    mounted() {
        this.loadUserSnippets().catch(() => {
            this.showNotification({
                title: 'Error',
                message: 'Unable to retrieve snippets',
                type: 'error'
            });
        });
    }
};
</script>
