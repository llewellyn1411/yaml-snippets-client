<template>
    <div class="page home" id="home-view">
        <SnippetList v-if="snippetList" :snippets="snippetList" :uid="uid" :isLoggedIn="isUserLoggedIn" />
    </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import SnippetList from '@/components/SnippetList';

export default {
    name: 'HomeView',
    components: {
        SnippetList
    },
    computed: {
        ...mapGetters('snippets', ['snippetList']),
        ...mapGetters('user', ['uid', 'isUserLoggedIn'])
    },
    methods: {
        ...mapActions('snippets', [`loadSnippets`])
    },
    async mounted() {
        await this.loadSnippets();
    }
};
</script>
