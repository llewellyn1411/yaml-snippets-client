<template>
    <div class="card snippet-list-item mb-2">
        <div class="card-header">
            <div class="card-title">
                <div class="title-section">
                    <h5>{{ name }}</h5>
                    <div v-if="isLoggedIn" class="star" :class="{ isActive: starred }" @click="toggleStar"></div>
                </div>
                <div class="counter-section">
                    <Counter label="stars" :value="countStar" />
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
                <button v-if="editable" @click="removeSnippet(id)" class="btn btn-primary">Delete</button>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex';
import Counter from '@/components/Counter';

// TODO: Remove snippet when deleted

export default {
    name: 'SnippetItem',
    components: {
        Counter
    },
    props: {
        uid: String,
        id: String,
        name: String,
        author: String,
        authorId: String,
        content: String,
        description: String,
        countStar: Number,
        editable: Boolean,
        starred: Boolean,
        isLoggedIn: Boolean
    },
    data() {
        return {
            isStarActionPending: false
        };
    },
    methods: {
        ...mapActions('snippets', ['removeSnippet', 'addStar', 'removeStar']),
        ...mapActions('notification', ['showNotification']),
        async toggleStar() {
            if (!this.isStarActionPending) {
                this.isStarActionPending = true;
                try {
                    if (!this.starred) {
                        await this.addStar({ userId: this.uid, snippetId: this.id });
                    } else {
                        await this.removeStar({ userId: this.uid, snippetId: this.id });
                    }
                } catch (e) {
                    this.showNotification({
                        title: 'Error',
                        message: 'Unable to perform star action',
                        type: 'error'
                    });
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
