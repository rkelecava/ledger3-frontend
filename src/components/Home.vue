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
        <div class="card-container" v-for='account in accounts' :key='account._id'>
          <router-link class="custom-card" :to="{name: 'Entries', params: { id: account._id }}">
            <div class="card border border-primary" style="width: 90%">
              <div class="card-body">
                <h5 class="card-title">{{ account.name }}</h5>
                <h6 class="card-subtitle mb-2 text-muted" v-show="account.type == 'asset'">Available Balance</h6>
                <h6 class="card-subtitle mb-2 text-muted" v-show="account.type == 'loan'">Remaining Balance</h6>
                <p class="card-text" v-bind:class="{ 'text-success': account.color == 'success', 'text-danger': account.color == 'danger' }">{{ account.balance | currency }}</p>
              </div>
            </div>
          </router-link>
        </div>
        <div class="card-container" v-show='accounts.length == 0'>
          <div class="custom-card">
            <div class="card border border-primary" style="width: 90%">
              <div class="card-body">
                <p class="card-text">Welcome to the Legder app.  This app is designed to supplement or replace 
                  your conventional check book.  To begin, start by adding an account from the Account Manager menu.  Next, 
                  create categories to describe your entries (ie. earnings, electric bill, car payment, etc.) using the Category 
                  Manager menu.  Finally, you can click on the account to view its ledger and begin adding entries. 
                </p>
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
  components: {
    Navbar
  },
  filters: {
    currency: function (value) {
      value = value.toFixed(2)
      value+=''
      var x = value.split('.')
      var x1 = x[0]
      var x2 = x.length > 1 ? '.' + x[1] : ''
      var rgx = /(\d+)(\d{3})/
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2')
      }
      return '$' + x1 + x2
    }
  },
  data () {
    return {
      alerts: [],
      user: {},
      accounts: []
    }
  },
  beforeMount() {
    if (!AUTH.isLoggedIn()) {
      return this.$router.push('/login')
    }
    this.user = AUTH.currentUser()
    ACCOUNTS.getAll(this.user._id)
    .then(res => {
      this.accounts = res.data
      for (var i = 0; i < this.accounts.length; i++) {
        if (this.accounts[i].type == 'asset') {
          if (this.accounts[i].balance >= 0) {
            this.accounts[i].color = 'success'
          } else {
            this.accounts[i].color = 'danger'
          }
        } else if (this.accounts[i].type == 'loan') {
          if (this.accounts[i].balance <= 0) {
            this.accounts[i].color = 'success'
          } else {
            this.accounts[i].color = 'danger'
          }
        }
      }
    })
    .catch(err => {
      this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: err.response.data })
      window.scrollTo(0,0)
    })
    .finally(() => {})
  },
  methods: {
    getAccountColor (balance, type) {
      var color = false
      if (type == 'asset') {
        if (balance >= 0) {
          color = true
        }
      } else if (type == 'loan') {
        if (balance <= 0) {
          color = true
        }
      }
      return color
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
</style>