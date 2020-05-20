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
                    <form @submit='resetPassword($event)' style="background-color: #ffffff; padding: 10px;">
                        <h3>Request a password reset</h3>
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1"><font-awesome-icon icon="lock" /></span>
                            </div>
                            <input type="password" v-model='password' id="password" name="password" class="form-control" placeholder="New password" required="required" />
                        </div>
                        <div class="input-group">
                            <button type="submit" class="btn btn-primary"><font-awesome-icon icon="sync" /> Reset password</button>
                        </div>
                        <div class="clearfix">
                            <a href="javascript:void(0);" @click='backToLogin()'>Go to Login</a>
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
            resetId: '',
            password: ''
        }
    },
    beforeMount () {
        if (AUTH.isLoggedIn()) {
            this.$router.push('/')
        }
    },
    mounted () {
        this.resetId = this.$route.params.id
        if (this.resetId === '') {
            this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: 'Please provide a valid password reset id' })
            return window.scrollTo(0,0)
        }
    },
    methods: {
        backToLogin () {
            this.$router.push('/login')
        },
        closeAlert (index) {
            this.alerts.splice(index, 1)
        },
        async resetPassword (evt) {
            evt.preventDefault()
            if (this.resetId === '') {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: 'Please provide a valid password reset id' })
                return window.scrollTo(0,0)
            }
            if (this.password === '') {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: 'New password is a required field' })
                return window.scrollTo(0,0)            
            }
            const payload = {
                resetId: this.resetId,
                password: this.password
            }
            AUTH.resetPassword(payload)
            .then(res => {
                this.alerts.push({ type: 'alert alert-success alert-dismissible fade show', msg: 'Your password has been successfully reset' })
                window.scrollTo(0,0)
            })
            .catch(err => {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: err.response.data })
                window.scrollTo(0,0)
            })
            .finally(() => { this.resetId = ''; this.password = '' })
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