<template>
    <div class="toast-wrapper" :class="{ active: isActive }">
        <div
            class="toast"
            :class="{ 'toast-success': type === 'success', 'toast-error': type === 'error', 'toast-warn': type === 'warning' }"
        >
            <button class="btn btn-clear float-right" @click="hide"></button>
            <h5 class="title">{{ title }}</h5>
            <p v-if="message" class="message">{{ message }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Toast',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        message: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'success'
        },
        onClose: {
            type: Function
        }
    },
    data() {
        return {
            isActive: false
        };
    },
    watch: {
        visible(value) {
            this.isActive = value;
        }
    },
    created() {
        this.isActive = this.visible;
    },
    methods: {
        hide() {
            this.isActive = false;
            this.onClose();
        }
    }
};
</script>
<style lang="scss" scoped>
.toast-wrapper {
    position: fixed;
    width: 100%;
    bottom: -200px;

    display: flex;
    justify-content: center;
    opacity: 0;

    transition: opacity 0.3s, bottom 0.3s;

    &.active {
        bottom: 50px;
        opacity: 1;
    }

    .toast {
        width: 640px;
    }
}
</style>
