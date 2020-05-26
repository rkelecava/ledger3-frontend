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
                            <h5 class="card-title">Category Analysis</h5>
                            <p class="card-text"><router-link :to="{ name: 'Home'}">Return to home</router-link></p>
                        </div>
                    </div>
                </div>
                <div class="card-container marge">
                    <div class="card border border-primary" style="width: 90%">
                        <div class="card-body">
                            <h5 class="card-title">History</h5>
                            <h6 class="card-subtitle mb-2 text-muted">Last 2 years</h6>
                        </div>
                    </div>
                </div>
                <div class="card-container" v-show='category.entries.length > 0' v-for='category in categories' :key='category.name' style="margin: 0px;">
                    <div class="card border border-primary" style="width: 90%">
                        <div class="card-body">
                            <h5 class="card-title">{{ category.name }} | ({{ category.total | currency }})</h5>
                            <ul>
                                <li v-for='entry in category.entries' :key='entry._id' style="font-size: .8em;">{{ entry.entered | date }}, {{ entry.description }} - {{ entry.amount | currency }}</li>
                            </ul>
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
import REPORTING from '@/services/REPORTING'

export default {
    data () {
        return {
            alerts: [],
            categories: []
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
        this.user = AUTH.currentUser()
        this.getCategories(this.user._id)
    },
    methods: {
        closeAlert (index) {
            this.alerts.splice(index, 1)
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
        },
        getCategories(id) {
            REPORTING.getAllCategories(id)
            .then(res => {
                this.categories = res.data
                this.categories.forEach((category) => {
                    category.total = 0
                    category.entries.forEach((entry) => {
                        category.total+=entry.amount
                    }, this)
                }, this)
            })
            .catch(err => {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: err.response.data })
                window.scrollTo(0,0)
            })
            .finally(() => {})
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