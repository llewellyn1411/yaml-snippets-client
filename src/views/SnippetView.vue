<template>
    <div v-if="!loading" class="card page-customise">
        <div class="card-header">
            <div class="card-title">
                <div class="title-section">
                    <h5>{{ snippet.name }}</h5>
                </div>
            </div>
            <div class="card-subtitle text-gray">{{ snippet.author.displayName }}</div>
        </div>
        <div class="card-body">
            <div class="form-group" v-for="(item, index) in variables" :key="index">
                <label class="form-label" :for="`input-${item.name}`">{{ item.name }}</label>
                <input
                    class="form-input"
                    type="text"
                    autocomplete="off"
                    :id="`input-${item.name}`"
                    :placeholder="item.name"
                    @input="onValueChanged(index, $event)"
                />
            </div>
            <code class="language-yaml" v-html="liveContent"></code>
        </div>
        <div class="card-footer">
            <button @click="onCopy" class="btn btn-primary">Copy</button>
        </div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import Prism from 'prismjs';
import 'prismjs/components/prism-yaml';
import firebase from '../firebase';
import Counter from '@/components/Counter';

const regex = /{{([a-zA-Z]+):([a-zA-Z0-9]+)}}/g;

export default {
    name: 'Snippet',
    components: { Counter },
    data() {
        return {
            loading: true,
            liveContent: '',
            unsubscribe: null,
            snippet: null,
            variables: []
        };
    },
    destroyed() {
        this.unsubscribe();
    },
    async created() {
        this.unsubscribe = firebase
            .firestore()
            .collection('snippets')
            .doc(this.id)
            .onSnapshot((doc) => {
                const data = doc.data();
                if (this.loading === true) {
                    this.loading = false;

                    this.snippet = {
                        id: doc.id,
                        ...data
                    };

                    const variables = [...this.snippet.content.matchAll(regex)];

                    this.variables = variables.map((variable) => {
                        return {
                            name: variable[1],
                            value: variable[2]
                        };
                    });
                } else {
                    this.snippet.copyCount = data.copyCount;
                }
            });
    },
    computed: {
        id() {
            return this.$route.params.id;
        }
    },
    watch: {
        variables() {
            const content = this.variables.reduce((output, variable) => {
                const regexStr = `{{${variable.name}:[a-zA-Z0-9]+}}`;
                return output.replace(new RegExp(regexStr, 'g'), variable.value);
            }, this.snippet.content);

            this.liveContent = Prism.highlight(content, Prism.languages.yaml, 'yaml');
        }
    },
    methods: {
        ...mapActions('snippets', ['loadSnippet', 'incrementSnippetCopies']),
        onValueChanged(index, value) {
            this.variables.splice(index, 1, Object.assign(this.variables[index], { value: value.target.value }));
        },
        async onCopy() {
            this.$copyText(this.liveContent).then(() => {
                // TODO: Show copied message
                this.incrementSnippetCopies(this.snippet.id);
            });
        }
    }
};
</script>
