<template>
    <div class="page home" id="home-view">
        <div class="has-icon-right mb-2">
            <input type="text" class="form-input" placeholder="Search Snippets" v-model="searchQuery" />
            <i class="form-icon" :class="{ loading: isSearching }"></i>
        </div>
        <LoadingIcon :visible="!snippetsInView" />
        <div v-if="snippetsInView">
            <SnippetList :snippets="snippetsInView" :uid="uid" :isLoggedIn="isUserLoggedIn" />
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
    </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import { debounce } from 'lodash';
import SnippetList from '@/components/SnippetList';
import LoadingIcon from '@/components/LoadingIcon';

export default {
    name: 'HomeView',
    components: {
        SnippetList,
        LoadingIcon
    },
    data() {
        return {
            isSearching: false,
            searchQuery: ''
        };
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
        },
        debounceSearch: debounce(function() {
            this.searchSnippets({ query: this.searchQuery, page: 1 }).then(() => {
                this.isSearching = false;
            });
        }, 500)
    },
    watch: {
        searchQuery() {
            this.isSearching = true;
            this.debounceSearch();
        }
    },
    async mounted() {
        await this.loadSnippets();
    }
};
</script>
