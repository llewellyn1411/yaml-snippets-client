<template>
    <div class="snippet-list">
        <SnippetItem
            :uid="uid"
            :isLoggedIn="isLoggedIn"
            :id="snippet.objectID"
            :name="snippet.name"
            :author="snippet.author.displayName"
            :authorId="snippet.author.uid"
            :description="snippet.description"
            :content="snippet.content"
            :countStar="snippet.countStar"
            :editable="snippet.author.uid === uid"
            :starred="starredSnippetIds.includes(snippet.objectID)"
            v-for="(snippet, index) in snippets"
            :key="index"
        />
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import SnippetItem from '@/components/SnippetItem';

// TODO: Update star count on star/unstar
export default {
    name: 'SnippetList',
    components: {
        SnippetItem
    },
    props: {
        snippets: Array,
        uid: String,
        isLoggedIn: Boolean
    },
    computed: {
        ...mapGetters('user', ['userDetails']),
        ...mapGetters('snippets', ['starredSnippetIds'])
    }
};
</script>
<style lang="scss">
.snippet-name,
.snippet-author {
    text-transform: lowercase;
}
</style>
