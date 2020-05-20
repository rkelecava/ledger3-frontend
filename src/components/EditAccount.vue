<template>
    <div>
        <Navbar />
        <div class="container" style="margin-bottom: 30px;">
            <center>
                <div class="card-container" v-show='alerts.length > 0'>
                    <div v-for='(alert, index) in alerts' :class='alert.type' role="alert">
                        {{ alert.msg }}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click='closeAlert(index)'>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </div>
                <div class="card-container">
                    <div class="card border border-primary" style="width: 90%">
                        <div class="card-body">
                            <h5 class="card-title">Edit Account</h5>
                            <p class="card-text"><router-link :to="{ name: 'AccountManager' }">Return to Account Manager</router-link></p>
                        </div>
                        <div class="clearfix" style="width: 90%;">
                            <form @submit='updateAccount($event)'>
                                <div class="row">
                                    <div class="col-centered">
                                        <div class="form-group">
                                            <label for="type">Account Type</label>
                                            <select v-model='account.type' id="type" name="type" class="form-control" style="width: 150px;">
                                                <option value=''>Select a type</option>
                                                <option value='asset'>asset</option>
                                                <option value='loan'>loan</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-centered">
                                        <div class="form-group">
                                            <label for="name">Account Name</label>
                                            <input type="text" v-model='account.name' id="name" name="name" class="form-control" placeholder="Enter Account Name" required="required" />
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-centered">
                                        <div class="form-group">
                                            <label for="balance">Initial Balance</label>
                                            <input type="text" v-model='account.balance' id="balance" name="balance" class="form-control" />
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-centered">
                                        <div class="form-group">
                                            <button type="submit" class="btn btn-primary btn-block">Submit <font-awesome-icon icon="plus" /></button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </center>
        </div>
    </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import AUTH from '@/services/AUTH'
import ACCOUNTS from '@/services/ACCOUNTS'

export default {
    data () {
        return {
            alerts: [],
            account: {
                name: '',
                type: '',
                balance: 0
            },
            user: {}
        }
    },
    components: {
        Navbar
    },
    beforeMount() {
        if (!AUTH.isLoggedIn()) {
            this.$router.push('/login')
            return
        }
        this.user = AUTH.currentUser()
        this.getAccount(this.$route.params.id)
    },
    methods: {
        closeAlert (index) {
            this.alerts.splice(index, 1)
        },
        getAccount (id) {
            ACCOUNTS.getOne(id)
            .then(res => {
                this.account = res.data
            })
            .catch(err => {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: err.response.data })
            })
            .finally(() => {})
        },
        async updateAccount (evt) {
            evt.preventDefault()
            this.account.balance = parseFloat(this.account.balance)
            if (this.account.type === '') {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: 'Account type is a required field' })
                return window.scrollTo(0,0)
            }
            if (this.account.name === '') {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: 'Account name is a required field' })
                return window.scrollTo(0,0)
            }
            if (isNaN(this.account.balance)) {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: 'Initial balance must be a valid number' })
                this.account.balance = 0
                return window.scrollTo(0,0)
            }
            ACCOUNTS.update(this.account._id, this.account)
            .then(res => {
                this.$router.push('/account-manager')
            })
            .catch(err => {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: err.response.data })
            })
            .finally(() => { this.user = {}; this.account = { name: '', type: '', balance: 0 }; })
        }
    }
}
</script>

<style scoped>
  .container {
    margin-top: 30px;
  }
  .card-container {
    margin-top: 30px;
  }
  a.custom-card,
  a.custom-card:hover {
    color: inherit
  }
  .col-centered {
    margin: 0 auto;
    float: none;
  }
</style>