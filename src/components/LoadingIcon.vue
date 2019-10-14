<template>
    <div v-if="visible" class="loading loading-lg"></div>
</template>

<script>
export default {
    name: 'LoadingIcon',
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    }
};
</script>
