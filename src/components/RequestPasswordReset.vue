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
                    <form @submit='requestPasswordReset($event)' style="background-color: #ffffff; padding: 10px;">
                        <h3>Request a password reset</h3>
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1"><font-awesome-icon icon="envelope" /></span>
                            </div>
                            <input type="text" v-model='email' id="email" name="email" class="form-control" placeholder="E-mail address" required="required" />
                        </div>
                        <div class="input-group">
                            <button type="submit" class="btn btn-primary"><font-awesome-icon icon="sync" /> Send password reset e-mail</button>
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
            email: ''
        }
    },
    beforeMount () {
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
        async requestPasswordReset (evt) {
            evt.preventDefault()
            if (this.email === '') {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: 'You must enter a valid e-mail address' })
                return window.scrollTo(0,0)
            }
            const payload = { email: this.email }
            AUTH.requestPasswordReset(payload)
            .then(res => {
                this.alerts.push({ type: 'alert alert-success alert-dismissible fade show', msg: 'A password reset link has been sent to ' + this.email + '.  If this link is not used within 24hrs, it will expire.' })
                window.scrollTo(0,0)
            })
            .catch(err => {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: err.response.data })
                window.scrollTo(0,0)
            })
            .finally(() => this.email = '')
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