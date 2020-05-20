<template>
    <div>
        <Navbar />
        <div class="container" style="margin-bottom: 30px;">
            <center>
                <div v-for='(alert, index) in alerts' :class='alert.type' role="alert">
                    {{ alert.msg }}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click='closeAlert(index)'>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="login-form" style="width: 90%;">
                    <form @submit='login($event)' style="background-color: #ffffff; padding: 10px;">
                        <h3>Login</h3>
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1"><font-awesome-icon icon="envelope" /></span>
                            </div>
                            <input type="text" v-model='user.username' id="username" name="username" class="form-control" placeholder="Username" required="required" />
                        </div>
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1"><font-awesome-icon icon="lock" /></span>
                            </div>
                            <input type="password" v-model='user.password' id="password" name="password" class="form-control" placeholder="Password" required="required" />
                        </div>
                        <div class="input-group">
                            <button type="submit" class="btn btn-primary btn-block">Login</button>
                        </div>
                        <div class="clearfix">
                            <router-link class="small-font" :to="{ name: 'Register'}">Need to Register?</router-link>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <router-link class="small-font" :to="{ name: 'RequestPasswordReset'}">Forgot Password?</router-link>
                        </div> 
                    </form>
                </div>
            </center>
        </div>
    </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import AUTH from '@/services/AUTH'

export default {
    components: {
        Navbar
    },
    data () {
        return {
            alerts: [],
            user: {
                username: '',
                password: ''
            }
        }
    },
    beforeMount () {
        if (AUTH.isLoggedIn()) {
            this.$router.push('/')
        }
    },
    methods: {
        closeAlert (index) {
            this.alerts.splice(index, 1)
        },
        async login (evt) {
            evt.preventDefault()
            if (this.user.username === '') {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: 'Username cannot be blank' })
                return window.scrollTo(0,0)
            }
            if (this.user.password === '') {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: 'Password cannot be blank' })
                return window.scrollTo(0,0)
            }
            AUTH.login(this.user)
            .then(res => {
                AUTH.saveToken(res.data.token)
                this.$router.push('/')
            })
            .catch(err => {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: err.response.data })
                window.scrollTo(0,0)
            })
            .finally(() => this.user = { username: '', password: '' })
        }
    }
}
</script>

<style>
.container {
    padding-top: 30px;
}
.input-group {
    margin-top: 20px;
}
.clearfix {
    margin-top: 20px;
}
.small-font {
    font-size: 80%;
}
</style>