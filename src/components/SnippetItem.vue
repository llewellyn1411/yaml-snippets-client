<template>
    <div class="card snippet-list-item mb-2">
        <div class="card-header">
            <div class="card-title">
                <div class="title-section">
                    <h5>{{ name }}</h5>
                    <div class="star" :class="{ isActive: starred }" @click="toggleStar"></div>
                </div>
                <div class="counter-section">
                    <Counter label="copies" :value="copyCount" />
                    <Counter label="stars" :value="starCount" />
                </div>
            </div>
            <div class="card-subtitle text-gray">{{ author }}</div>
        </div>
        <div class="card-body">
            {{ description }}
        </div>
        <div class="card-footer">
            <div class="btn-group btn-group-block">
                <router-link :to="`/snippet/${id}`" class="btn btn-primary">Customise</router-link>
                <router-link v-if="editable" :to="`/snippet/edit/${id}`" class="btn btn-primary">Edit</router-link>
                <button v-if="editable" @click="deleteSnippet(id)" class="btn btn-primary">Delete</button>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex';
import Counter from '@/components/Counter';

export default {
    name: 'SnippetItem',
    components: {
        Counter
    },
    props: {
        id: String,
        name: String,
        author: String,
        authorId: String,
        content: String,
        description: String,
        copyCount: Number,
        starCount: Number,
        editable: Boolean,
        starred: Boolean
    },
    data() {
        return {
            isStarActionPending: false
        };
    },
    methods: {
        ...mapActions('snippets', ['deleteSnippet', 'addStar', 'removeStar']),
        async toggleStar() {
            if (!this.isStarActionPending) {
                this.isStarActionPending = true;
                if (!this.starred) {
                    await this.addStar({ userId: this.authorId, snippetId: this.id });
                } else {
                    await this.removeStar({ userId: this.authorId, snippetId: this.id });
                }
                this.isStarActionPending = false;
            }
        }
    }
};
</script>
<style lang="scss">
.snippet-list-item {
    .card-title {
        display: flex;
        flex-direction: row;

        .title-section {
            display: flex;

            .star {
                font-size: 13px;
                filter: saturate(0);

                transition: filter 0.5s;

                &.isActive {
                    filter: saturate(1);
                }
            }
        }

        .counter-section {
            display: flex;

            margin-left: auto;
        }
    }

    .card-subtitle {
        margin-top: -20px;
    }

    .card-body {
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>
