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
                            <h5 class="card-title">Edit {{ entryA.description }}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">{{ entryA.entered | date }}</h6>
                            <h6 class="card-subtitle mb-2 text-muted">Type: {{ entryA.type }}</h6>
                            <p class="card-text"><router-link :to="{ name: 'Entries', params: { id: $route.params.accountId }}">Return to {{ account.name }}</router-link></p>
                        </div>
                        <div class="clearfix" style="width: 90%;">
                            <form @submit='updateEntry($event)'>
                                <div class="row">
                                    <div class="col-centered">
                                        <div class="form-group">
                                            <label for="category">Category</label>
                                            <select v-model='entryA.category' id="category" name="category" class="form-control">
                                                <option value=''>Select a category</option>
                                                <option v-for='category in categories' :key='category._id' :value='category.name'>{{ category.name }}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-centered">
                                        <div class="form-group">
                                            <label for="description">Description</label>
                                            <input type="text" v-model='entryA.description' id="description" name="description" class="form-control" placeholder="Enter a description" required="required" />
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-centered">
                                        <div class="form-group">
                                            <label for="amount">Amount</label>
                                            <input type="text" v-model='entryA.amount' id="amount" name="amount" class="form-control" required />
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-6">
                                        <div class="form-group">
                                            <button type="submit" class="btn btn-primary btn-block">Submit <font-awesome-icon icon="plus" /></button>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-group">
                                            <button @click="deleteEntry(account._id, entry._id)" class="btn btn-danger btn-block">Delete</button>
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
import ENTRIES from '@/services/ENTRIES'
import CATEGORIES from '@/services/CATEGORIES'
import ACCOUNTS from '@/services/ACCOUNTS'

export default {
    data () {
        return {
            alerts: [],
            entryA: {
                _id: '',
                description: '',
                category: '',
                type: '',
                amount: 0
            },
            user: {},
            categories: [],
            account: {
                _id: null
            }
        }
    },
    filters: {
        date: function (value) {
            var d = new Date(value)
            return ((d.getMonth()+1) + '/' + d.getDate() + '/' + d.getFullYear())
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
        if (!this.$route.params.entryId) {
            this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: 'Missing Entry Id' })
            return window.scrollTo(0,0)
        } else if (!this.$route.params.accountId) {
            this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: 'Missing Account Id' })
            return window.scrollTo(0,0)  
        } else {
            this.user = AUTH.currentUser()
            this.getEntry(this.$route.params.entryId)
            this.getCategories(this.user._id)
            this.getAccount(this.$route.params.accountId)
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
            })
            .catch(err => {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: err.response.data })
                window.scrollTo(0,0)
            })
            .finally(() => {})
        },
        getEntry (id) {
            ENTRIES.getOne(id)
            .then(res => {
                this.entryA = res.data
            })
            .catch(err => {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: err.response.data })
                window.scrollTo(0,0)
            })
            .finally(() => {})
        },
        getCategories (id) {
            CATEGORIES.getAll(id)
            .then(res => {
                this.categories = res.data
            })
            .catch(err => {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: err.response.data })
                window.scrollTo(0,0)
            })
            .finally(() => {})
        },
        async updateEntry (evt) {
            evt.preventDefault()
            if (this.entryA.description === '') {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: 'Description is a required field' })
                return window.scrollTo(0,0)
            }
            if (this.entryA.category === '') {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: 'Please select a category for this entry' })
                return window.scrollTo(0,0)
            }
            if (isNaN(this.entryA.amount)) {
               this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: 'Please enter a valid amount' })
               return window.scrollTo(0,0)                
            }
            if (this.entryA.amount <= 0) {
               this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: 'Amount must be a number greater than zero' })
               return window.scrollTo(0,0)
            }
            ENTRIES.update(this.entry._id, this.entry)
            .then(res => {
                this.$router.push('/entries/' + this.account._id)
            })
            .catch(err => {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: err.response.data })
                window.scrollTo(0,0)
            })
            .finally(() => { this.user = {}; this.entryA = { description: '', amount: 0, type: '', category: '' }; })
        },
        deleteEntry (accountId, entryId) {
            ENTRIES.deleteOne(accountId, entryId)
            .then(res => {
                this.$router.push('/entries/' + this.account._id)
            })
            .catch(err => {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: err.response.data })
                window.scrollTo(0,0)
            })
            .finally(() => { this.user = {}; this.entryA = { description: '', amount: 0, type: '', category: '' }; })
        },
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