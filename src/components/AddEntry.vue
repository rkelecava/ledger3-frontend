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
                            <h5 class="card-title">Add a New Entry</h5>
                            <p class="card-text"><router-link :to="{ name: 'Entries', params: { id: account._id }}">Return to {{ account.name }}</router-link></p>
                        </div>
                        <div class="clearfix" style="width: 90%;">
                            <form @submit='addEntry($event)'>
                                <div class="row">
                                    <div class="col-centered">
                                        <div class="form-group">
                                            <label for="type">Type</label>
                                            <select v-model='entry.type' id="type" name="type" class="form-control" style="width: 150px;">
                                                <option value=''>Select a type</option>
                                                <option value='deposit'>deposit</option>
                                                <option value='payment'>payment</option>
                                                <option value='withdrawl'>withdrawl</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-centered">
                                        <div class="form-group">
                                            <label for="category">Category</label>
                                            <select v-model='entry.category' id="category" name="category" class="form-control">
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
                                            <input type="text" v-model='entry.description' id="description" name="description" class="form-control" required />
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-centered">
                                        <div class="form-group">
                                            <label for="amount">Amount</label>
                                            <input type="text" v-model='entry.amount' id="amount" name="amount" class="form-control" required />
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-centered">
                                        <div class="form-group">
                                            <button type="submit" class="btn btn-primary btn-block">Add <font-awesome-icon icon="plus" /></button>
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
import CATEGORIES from '@/services/CATEGORIES'
import ENTRIES from '@/services/ENTRIES'

export default {
    data () {
        return {
            alerts: [],
            entry: {
                type: '',
                category: '',
                description: '',
                amount: 0
            },
            account: {
                _id: null,
                balance: 0
            },
            categories: [],
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
        if (!this.$route.params.id) {
            this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: 'Missing Account Id' })
            return window.scrollTo(0,0)
        } else {
            this.account._id = this.$route.params.id
            this.user = AUTH.currentUser()
            this.getAccount(this.$route.params.id)
            this.getCategories(this.user._id)
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
        async addEntry (evt) {
            evt.preventDefault()
            this.entry.amount = parseFloat(this.entry.amount)
            if (this.entry.type === '') {
               this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: 'Entry type is a required field' })
               return window.scrollTo(0,0)
            }
            if (this.entry.category === '') {
               this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: 'Category is a required field' })
               return window.scrollTo(0,0)
            }
            if (this.entry.description === '') {
               this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: 'Description is a required field' })
               return window.scrollTo(0,0)
            }
            if (isNaN(this.entry.amount)) {
               this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: 'Please enter a valid amount' })
               return window.scrollTo(0,0)                
            }
            if (this.entry.amount <= 0) {
               this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: 'Amount must be a number greater than zero' })
               return window.scrollTo(0,0)
            }
            ENTRIES.add(this.account._id, this.entry)
            .then(res => {
                this.$router.push('/entries/' + this.account._id)
            })
            .catch(err => {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: err.response.data })
                window.scrollTo(0,0)
            })
            .finally(() => { this.entry = { type: '', category: '', description: '', amount: 0 }})
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