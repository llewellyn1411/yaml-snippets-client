<template>
    <section class="page-create">
        <h2>Create Snippet</h2>
        <form class="form-horizontal">
            <InputText
                name="Name"
                placeholder="Name"
                :tabIndex="5"
                :maxlength="10"
                :validator="validateName"
                @state-change="onNameValidityChange"
                v-model="name"
            />
            <InputText
                name="Description"
                placeholder="Description"
                type="textarea"
                :tabIndex="6"
                :maxlength="500"
                :validator="validateDescription"
                @state-change="onDescriptionValidityChange"
                v-model="description"
            />
            <InputText
                name="Snippet"
                placeholder="Snippet"
                type="textarea"
                :tabIndex="7"
                :maxlength="1000"
                :validator="validateSnippet"
                @state-change="onSnippetValidityChange"
                v-model="snippet"
            />

            <button
                type="button"
                class="btn btn-primary btn-block"
                tabindex="8"
                :class="{ loading: isSubmitBtnLoading }"
                :disabled="!isValidForm"
                @click="onSubmit"
            >
                Create
            </button>
        </form>
    </section>
</template>
<script>
import { mapActions } from 'vuex';
import InputText from '../components/InputText';
export default {
    name: 'SnippetCreateView',
    components: {
        InputText
    },
    data() {
        return {
            name: '',
            description: '',
            snippet: '',
            author: '',
            tags: [],
            isValidForm: false,
            isSubmitBtnLoading: false,
            errors: {
                name: false,
                description: false,
                snippet: false
            }
        };
    },
    methods: {
        ...mapActions('snippets', ['addSnippet']),
        validate() {
            this.isValidForm = this.errors.name && this.errors.description && this.errors.snippet;
        },
        validateName(name) {
            const isValid = name && name.length >= 4 && name.length <= 10;
            return {
                isValid,
                message: isValid ? '' : 'Name must be more than 4 characters'
            };
        },
        onNameValidityChange(payload) {
            const { isValid, message } = payload;

            this.errors.name = isValid;

            this.validate();
        },
        validateDescription(description) {
            const isValid = description && description.length >= 10 && description.length <= 500;
            return {
                isValid,
                message: isValid ? '' : 'Description must be more than 10 characters'
            };
        },
        onDescriptionValidityChange(payload) {
            const { isValid, message } = payload;

            this.errors.description = isValid;

            this.validate();
        },
        validateSnippet(snippet) {
            const isValid = snippet && snippet.length >= 10 && snippet.length <= 1000;
            return {
                isValid,
                message: isValid ? '' : 'Snippet must be more than 10 characters'
            };
        },
        onSnippetValidityChange(payload) {
            const { isValid, message } = payload;

            this.errors.snippet = isValid;

            this.validate();
        },
        async onSubmit() {
            if (this.isValidForm) {
                this.isSubmitBtnLoading = true;
                await this.addSnippet({
                    name: this.name,
                    description: this.description,
                    content: this.snippet
                });
                this.isSubmitBtnLoading = false;
                this.$router.push('/');
            }
        }
    }
};
</script>
