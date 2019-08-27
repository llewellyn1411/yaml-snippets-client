<template>
    <div class="page edit" id="edit-view">
        <v-form v-if="activeSnippet" v-model="valid" ref="form" lazy-validation>
            <v-text-field v-model="activeSnippet.name" :counter="30" :rules="nameRules" label="Name" required clearable></v-text-field>
            <v-textarea
                v-model="activeSnippet.description"
                :counter="500"
                :rules="descriptionRules"
                label="Description"
                auto-grow
            ></v-textarea>
            <v-textarea v-model="activeSnippet.content" :counter="1000" :rules="contentRules" label="Dockerfile" auto-grow></v-textarea>
            <v-btn :disabled="!valid" :loading="submitting" @click="submit">Edit</v-btn>
        </v-form>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'SnippetEdit',
    data() {
        return {
            name: '',
            description: '',
            content: '',
            author: '',
            tags: [],
            valid: false,
            submitting: false,
            loading: true,
            nameRules: [
                (v) => !!v || 'Name is required',
                (v) => (v && v.length <= 30 && v.length >= 4) || 'Name must be between 4 and 30 characters'
            ],
            descriptionRules: [
                (v) => !!v || 'Description is required',
                (v) => (v && v.length <= 500 && v.length >= 10) || 'Description must be between 10 and 500 characters'
            ],
            contentRules: [
                (v) => !!v || 'Content is required',
                (v) => (v && v.length <= 1000 && v.length >= 10) || 'Dockerfile must be between 10 and 500 characters'
            ]
        };
    },
    async mounted() {
        this.$vs.loading({ container: '#edit-view', type: 'radius' });
        await this.loadSnippet(this.id);
        this.$vs.loading.close('#edit-view > .con-vs-loading');
    },
    computed: {
        ...mapGetters('snippets', ['activeSnippet']),
        id() {
            return this.$route.params.id;
        }
    },
    methods: {
        ...mapActions('snippets', [`addSnippet`, `loadSnippet`, `editSnippet`]),
        async submit() {
            if (this.$refs.form.validate()) {
                this.submitting = true;

                await this.editSnippet(this.activeSnippet);

                this.submitting = false;

                this.$router.push('/');
            }
        }
    }
};
</script>
