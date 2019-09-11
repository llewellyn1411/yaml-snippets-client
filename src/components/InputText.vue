<template>
    <div class="form-group mb-2" :class="{ 'has-error': inputValue && !isValid, 'has-success': inputValue && isValid }">
        <div class="col-3 col-sm-12 ">
            <label class="form-label" :for="`{input-${name}}`">{{ name }}</label>
        </div>
        <div class="col-9 col-sm-12">
            <input
                v-if="type === 'text'"
                class="form-input"
                type="text"
                :id="`{input-${name.toLowerCase()}}`"
                :placeholder="placeholder"
                :tabindex="tabIndex"
                :maxlength="maxlength && maxlength > 0 ? maxlength : 1000"
                v-model="inputValue"
                @input="onChange"
            />
            <textarea
                v-else-if="type === 'textarea'"
                class="form-input"
                type="text"
                :id="`{input-${name.toLowerCase()}}`"
                :placeholder="placeholder"
                :tabindex="tabIndex"
                :maxlength="maxlength && maxlength > 0 ? maxlength : 1000"
                v-model="inputValue"
                @input="onChange"
            ></textarea>
        </div>
        <section class="section-info">
            <p class="form-input-hint" :class="{ 'd-invisible': isValid }">{{ message }}</p>
            <p class="character-counter" v-if="maxlength && maxlength > 0">{{ inputValue.length }}/{{ maxlength }}</p>
        </section>
    </div>
</template>

<script>
export default {
    name: 'InputText',
    props: {
        value: String,
        type: {
            type: String,
            default: 'text'
        },
        name: String,
        placeholder: String,
        validator: Function,
        tabIndex: Number,
        maxlength: Number
    },
    data() {
        return {
            inputValue: '',
            message: '',
            isValid: true
        };
    },
    watch: {
        value(value) {
            this.inputValue = value;
        }
    },
    methods: {
        onChange() {
            const previouslyValid = this.isValid;
            const { isValid, message } = this.validator(this.inputValue);
            this.isValid = isValid;
            this.message = message;

            this.$emit('input', this.inputValue);
            if (this.isValid !== previouslyValid) {
                this.$emit('state-change', { isValid, message });
            }
        }
    }
};
</script>
<style lang="scss">
.section-info {
    display: flex;
    flex-basis: 100%;

    .character-counter {
        margin-left: auto;

        font-size: 0.8em;
    }
}
</style>
