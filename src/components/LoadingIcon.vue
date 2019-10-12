<template>
    <div v-if="visible" class="loading loading-lg"></div>
</template>

<script>
export default {
    name: 'LoadingIcon',
    components: {},
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            //
        };
    }
};
</script>
