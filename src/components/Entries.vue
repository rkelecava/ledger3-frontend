<template>
    <div>
        <Navbar />
        <div class="container" style="margin-bottom: 30px;">
            <center>
                <div class="card-container marge" v-show='alerts.length > 0'>
                    <div v-for='(alert, index) in alerts' :class='alert.type' role="alert">
                        {{ alert.msg }}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click='closeAlert(index)'>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </div>
                <div class="card-container marge marge-bottom">
                    <div class="card border border-primary" style="width: 90%">
                        <div class="card-body">
                            <h5 class="card-title">{{ account.name }}</h5>
                            <h6 class="card-subtitle mb-2 text-muted" v-show="account.type == 'asset'">Available Balance</h6>
                            <h6 class="card-subtitle mb-2 text-muted" v-show="account.type == 'loan'">Remaining Balance</h6>
                            <p class="card-text" v-bind:class="{ 'text-success': account.color == 'success', 'text-danger': account.color == 'danger' }">{{ account.balance | currency }}</p>
                            <p class="card-text"><router-link :to="{ name: 'Home'}">Return to home</router-link></p>
                            <router-link class="btn btn-primary" :to="{ name: 'AddEntry', params: { id: account._id }}">Add Entry</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-container marge">
                    <div class="card border border-primary" style="width: 90%">
                        <div class="card-body">
                            <h5 class="card-title">Recent Transactions</h5>
                        </div>
                    </div>
                </div>
                <div class="card-container" v-for='entry in entries' :key='entry._id' style="margin: 0px;">
                    <router-link class="custom-card" :to="{name: 'EditEntry', params: { accountId: account._id, entryId: entry._id }}">
                        <div class="card border border-primary" style="width: 90%">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-7" v-bind:class="{ 'text-success': entry.color == 'success', 'text-danger': entry.color == 'danger' }" style="text-align: left;">{{ entry.description }}</div>
                                    <div class="col-5" v-bind:class="{ 'text-success': entry.color == 'success', 'text-danger': entry.color == 'danger' }"><strong><span v-show="entry.type == 'withdrawl' || entry.type == 'payment'">(</span>{{ entry.amount | currency }}<span v-show="entry.type == 'withdrawl' || entry.type == 'payment'">)</span></strong></div>
                                </div>
                                <div class="row">
                                    <div class="col-5 text-muted smaller" style="text-align: left;">{{ entry.entered | date }}</div>
                                    <div class="col-2"></div>
                                    <div class="col-5 text-muted smaller">{{ entry.balanceAfterTransaction | currency }}</div>
                                </div>
                            </div>
                        </div>
                    </router-link>
                </div>
                <div class="card-container" v-show='showMore' style="margin: 0px;">
                    <div class="card border border-primary" style="width: 90%">
                        <div class="card-body">
                            <p><button class="btn btn-success" @click='getMoreEntries()'>Show More...</button></p>
                        </div>
                    </div>
                </div>
                <div class="card-container" v-show='entries.length === 0' style="margin: 0px;">
                    <div class="card border border-primary" style="width: 90%">
                        <div class="card-body">
                            <p>There are no entries to display</p>
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
import ENTRIES from '@/services/ENTRIES'

export default {
    data () {
        return {
            alerts: [],
            account: {
                _id: null,
                balance: 0
            },
            entries: [],
            skip: 0,
            limit: 3,
            showMore: false
        }
    },
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
            var val = x1 + x2
            return '$' + val
        },
        date: function (value) {
            var d = new Date(value)
            return ((d.getMonth()+1) + '/' + d.getDate() + '/' + d.getFullYear())
        }
    },
    beforeMount () {
        if (!AUTH.isLoggedIn()) {
            this.$router.push('/login')
            return
        }
        if (!this.$route.params.id) {
            this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: 'Missing Account Id' })
            return window.scrollTo(0,0)
        } else {
            this.account._id = this.$route.params.id
            this.getAccount(this.$route.params.id)
            this.getEntries(this.$route.params.id, this.skip, this.limit)
        }
    },
    methods: {
        closeAlert (index) {
            this.alerts.splice(index, 1)
        },
        getAccount (id) {
            ACCOUNTS.getOne(id)
            .then(res => {
                this.account = res.data
                if (this.account.type == 'asset') {
                    if (this.account.balance >= 0) {
                        this.account.color = 'success'
                    } else {
                        this.account.color = 'danger'
                    }
                } else if (this.account.type == 'loan') {
                    if (this.account.balance <= 0) {
                        this.account.color = 'success'
                    } else {
                        this.account.color = 'danger'
                    }
                }
            })
            .catch(err => {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: err.response.data })
                window.scrollTo(0,0)
            })
            .finally(() => {})
        },
        getEntries (id, skip, limit) {
            ENTRIES.getAll(id, skip, limit)
            .then(res => {
                this.entries = res.data
                for (var i = 0; i < this.entries.length; i++) {
                    if (this.account.type == 'asset') {
                    if (this.entries[i].type == 'deposit') {
                        this.entries[i].color = 'success'
                    } else {
                        this.entries[i].color = 'danger'
                    }
                    } else if (this.account.type == 'loan') {
                    if (this.entries[i].type == 'withdrawl' || this.entries[i].type == 'payment') {
                        this.entries[i].color = 'success'
                    } else {
                        this.entries[i].color = 'danger'
                    }
                    }
                }
                if (this.entries.length > 0) {
                    if ((this.entries.length % this.limit) === 0) {
                        this.showMore = true
                    }
                }
            })
            .catch(err => {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: err.response.data })
                window.scrollTo(0,0)
            })
            .finally(() => {})
        },
        getMoreEntries () {
            this.skip+=this.limit
            this.showMore = false
            ENTRIES.getAll(this.account._id, this.skip, this.limit)
            .then(res => {
                for (var i = 0; i < res.data.length; i++) {
                    if (this.account.type == 'asset') {
                    if (res.data[i].type == 'deposit') {
                        res.data[i].color = 'success'
                    } else {
                        res.data[i].color = 'danger'
                    }
                    } else if (this.account.type == 'loan') {
                    if (res.data[i].type == 'withdrawl' || res.data[i].type == 'payment') {
                        res.data[i].color = 'success'
                    } else {
                        res.data[i].color = 'danger'
                    }
                    }
                }
                this.entries = this.entries.concat(res.data)
                if (this.entries.length > 0) {
                    if ((this.entries.length % this.limit) === 0) {
                        this.showMore = true
                    }
                }
            })
            .catch(err => {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: err.response.data })
                window.scrollTo(0,0)
            })
            .finally(() => {})
        },
        addCommas (nStr) {
            nStr += ''
            var x = nStr.split('.')
            var x1 = x[0]
            var x2 = x.length > 1 ? '.' + x[1] : ''
            var rgx = /(\d+)(\d{3})/
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2')
            }
            return x1 + x2
        }
    }
}
</script>

<style>
  .container {
    margin-top: 30px;
  }
  .marge {
    margin-top: 30px;
  }
  .margeBottom {
      margin-bottom: 30px;
  }
  .noMarge {
      margin: 0px;
  }
  .smaller {
      font-size: 80%;
      font-style: italic;
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