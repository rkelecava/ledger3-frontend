<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <a class="navbar-brand" href="/">{{ appName }}</a>
        <button v-show='isLoggedIn === true' class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div v-show='isLoggedIn === true' class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ml-auto" v-show='isLoggedIn === true'>
                <li class="nav-item">
                    <router-link class="nav-link" :to="{name: 'AccountManager'}">Account Manager</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" :to="{name: 'CategoryManager'}">Category Manager</router-link>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="javascript:void(0);" @click='logout()'>Logout</a>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
import AUTH from '@/services/AUTH'
import MISC from '@/services/MISC'

export default {
    data () {
        return {
            isLoggedIn: false,
            appName: ''
        }
    },
    beforeMount() {
        this.isLoggedIn = AUTH.isLoggedIn()
        this.getAppName()
    },
    methods: {
        logout () {
            AUTH.logout()
            this.$router.push('/login')
        },
        goToAccountManager () {
            this.$router.push('/account-manager')
        },
        getAppName () {
            MISC.getName()
            .then(res => {
                this.appName = res.data.name
            })
            .catch(err => {
                console.log(err.response.data)
            })
            .finally(() => {})
        }
    }
}
</script>

<style></style>