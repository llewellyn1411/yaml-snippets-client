<template>
    <div class="page home" id="home-view">
        <SnippetList v-if="snippetList" :snippets="snippetList" :uid="uid" />
    </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import SnippetList from '@/components/SnippetList';

export default {
    name: 'Home',
    components: {
        SnippetList
    },
    computed: {
        ...mapGetters('snippets', ['snippetList']),
        ...mapState('user', ['uid'])
    },
    methods: {
        ...mapActions('snippets', [`loadSnippets`])
    },
    async mounted() {
        this.$vs.loading({ container: '#home-view', type: 'radius' });

        await this.loadSnippets();

        this.$vs.loading.close('#home-view > .con-vs-loading');
    }
};
</script>
