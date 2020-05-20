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
                            <h5 class="card-title">Account Manager</h5>
                            <p class="card-text"><router-link :to="{ name: 'Home'}">Return to home</router-link></p>
                            <router-link class="btn btn-primary" :to="{ name: 'AddAccount'}">Add Account</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-container">
                    <div class="card border border-primary" style="width: 90%">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-centered">
                                    <h6 class="card-subtitle mb-2 text-muted">Existing Accounts</h6>
                                    <ul>
                                        <li v-for='account in accounts' :key='account._id'>{{ account.name }} / <a href="javascript:void(0)" @click='editAccount(account._id)'>Edit</a> | <a href="javascript:void(0);" @click='deleteAccount(user._id, account._id)'>Delete</a></li>
                                        <p v-show='accounts.length === 0'>There are no accounts to display</p>
                                    </ul>
                                </div>
                            </div>
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
            accounts: [],
            user: {}
        }
    },
    components: {
        Navbar
    },
    beforeMount () {
        if (!AUTH.isLoggedIn()) {
            this.$router.push('/login')
            return
        }
        this.user = AUTH.currentUser()
        this.getAccounts(this.user._id)
    },
    methods: {
        closeAlert (index) {
            this.alerts.splice(index, 1)
        },
        getAccounts (id) {
            ACCOUNTS.getAll(id)
            .then(res => {
                this.accounts = res.data
            })
            .catch(err => {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: err.response.data })
            })
            .finally(() => {})
        },
        deleteAccount (userId, accountId) {
            ACCOUNTS.deleteOne(userId, accountId)
            .then(res => {
                for (var i = 0; i < this.accounts.length; i++) {
                    if (this.accounts[i]._id === accountId) {
                        this.accounts.splice(i, 1)
                    }
                }
            })
            .catch(err => {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: err.response.data })
                return window.scrollTo(0,0)
            })
            .finally(() => {})
        },
        editAccount (accountId) {
            this.$router.push('/edit-account/' + accountId)
        }
    }
}
</script>

<style>
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
  li {
      text-align: left;
  }
  .col-centered {
    margin: 0 auto;
    float: none;
  }
</style>