<template>
    <div class="page home" id="home-view">
        <SnippetList v-if="snippetsInView" :snippets="snippetsInView" :uid="uid" :isLoggedIn="isUserLoggedIn" />
        <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a href="#" @click="navigateToPreviousPage">Previous</a>
            </li>
            <li class="page-item" :class="{ active: index === currentPage }" v-for="index in totalPages" :key="index">
                <a href="#" @click="navigateToPage(index)">{{ index }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a href="#" @click="navigateToNextPage">Next</a>
            </li>
        </ul>
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
        ...mapGetters('snippets', ['snippetsInView', 'snippetQuery', 'totalPages', 'currentPage']),
        ...mapGetters('user', ['uid', 'isUserLoggedIn'])
    },
    methods: {
        ...mapActions('snippets', ['loadSnippets', 'searchSnippets']),
        navigateToPage(index) {
            this.searchSnippets({ query: this.snippetQuery, page: index });
        },
        navigateToPreviousPage() {
            this.searchSnippets({ query: this.snippetQuery, page: this.currentPage - 1 });
        },
        navigateToNextPage() {
            this.searchSnippets({ query: this.snippetQuery, page: this.currentPage + 1 });
        }
    },
    async mounted() {
        await this.loadSnippets();
    }
};
</script>
