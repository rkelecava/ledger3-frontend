<template>
    <div>
        <Navbar />
        <div class="container" style="margin-bottom: 30px;">
            <center>
                <div v-for='(alert, index) in alerts' :class='alert.type' role="alert">
                    {{ alert.msg }}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="login-form" style="width: 90%;">
                    <form @submit='register($event)' style="background-color: #ffffff; padding: 10px;">
                        <h3>Register</h3>
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
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1"><font-awesome-icon icon="lock" /></span>
                            </div>
                            <input type="password" v-model='user.confirmation' id="confirmation" name="confirmation" class="form-control" placeholder="Confirm Password" required="required" />
                        </div>
                        <div class="input-group">
                            <button type="submit" class="btn btn-primary btn-block">Register</button>
                        </div>
                        <div class="clearfix">
                            <a href="javascript:void(0);" @click='backToLogin()'>Back to Login</a>
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
                password: '',
                confirmation: ''
            }
        }
    },
    beforeMount() {
        if (AUTH.isLoggedIn()) {
            this.$router.push('/')
        }
    },
    methods: {
        backToLogin () {
            this.$router.push('/login')
        },
        closeAlert (index) {
            this.alerts.splice(index, 1)
        },
        async register (evt) {
            evt.preventDefault()
            if (this.user.username === '') {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: 'Username cannot be blank' })
                return window.scrollTo(0,0)
            }
            if (this.user.password === '') {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: 'Password cannot be blank' })
                return window.scrollTo(0,0)
            }
            if (this.user.confirmation === '') {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: 'Password confirmation cannot be blank' })
                return window.scrollTo(0,0)
            }
            if (this.user.password !== this.user.confirmation) {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: 'Password does not match the confirmation' })
                return window.scrollTo(0,0)
            }
            AUTH.register(this.user)
            .then(res => {
                AUTH.saveToken(res.data.token)
                this.$router.push('/')
            })
            .catch(err => {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: JSON.stringify(err.response.data) })
                window.scrollTo(0,0)
            })
            .finally(() => this.user = { username: '', password: '', confirmation: '' })
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
</style>