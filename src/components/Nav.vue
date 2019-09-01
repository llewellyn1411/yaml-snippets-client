<template>
    <header class="navbar">
        <div class="navbar container">
            <section class="navbar-section">
                <router-link to="/" class="btn btn-link" tabindex="1"><span>YAML SNIPPETS</span></router-link>
            </section>
            <div class="menu-button" :class="{ opened: isMenuOpened }" @click="toggle">
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
            </div>
            <section class="navbar-section menu-items" :class="{ closed: !isMenuOpened }">
                <router-link to="/" class="btn btn-link" tabindex="2"><span>Explore</span></router-link>
                <router-link v-if="isLoggedIn" to="/snippet/create" class="btn btn-link" tabindex="3"><span>Create</span></router-link>
                <router-link v-if="!isLoggedIn" to="/signin" class="btn btn-link" tabindex="4"><span>Sign In</span></router-link>
                <a v-if="isLoggedIn" href="#" class="btn btn-link" tabindex="4" @click="signOut"><span>Sign Out</span></a>
            </section>
        </div>
    </header>
</template>

<script>
export default {
    name: 'Nav',
    components: {},
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        isLoggedIn: {
            type: Boolean,
            default: false
        },
        onSignOut: {
            type: Function
        }
    },
    data() {
        return {
            isMenuOpened: false
        };
    },
    methods: {
        toggle() {
            this.isMenuOpened = !this.isMenuOpened;
        },
        signOut() {
            this.onSignOut();
        }
    }
};
</script>
