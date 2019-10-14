<template>
    <div class="counter-container">
        <div class="counter-value">{{ value }}</div>
        <div class="counter-label">{{ label }}</div>
    </div>
</template>

<script>
export default {
    name: 'Counter',
    components: {},
    props: {
        value: {
            type: Number,
            default: 0
        },
        label: {
            type: String,
            default: ''
        }
    }
};
</script>
<style lang="scss">
.counter-container {
    padding: 0 10px;
    box-sizing: border-box;
    text-align: right;

    .counter-value {
        font-weight: bold;
    }

    .counter-label {
        text-transform: capitalize;
    }
}
</style>
