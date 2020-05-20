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
                            <h5 class="card-title">Category Manager</h5>
                            <p class="card-text"><router-link :to="{ name: 'Home'}">Return to home</router-link></p>
                            <router-link class="btn btn-primary" :to="{ name: 'AddCategory'}">Add Category</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-container">
                    <div class="card border border-primary" style="width: 90%">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-centered">
                                    <h6 class="card-subtitle mb-2 text-muted">Existing Categories</h6>
                                    <ul>
                                        <li v-for='category in categories' :key='category._id'>{{ category.name }} / <a href="javascript:void(0)" @click='editCategory(category._id)'>Edit</a> | <a href="javascript:void(0);" @click='deleteCategory(user._id, category._id)'>Delete</a></li>
                                    </ul>
                                    <p v-show='categories.length === 0'>There are no categories to display</p>
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
import CATEGORIES from '@/services/CATEGORIES'

export default {
    data () {
        return {
            alerts: [],
            categories: [],
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
        this.getCategories(this.user._id)
    },
    methods: {
        closeAlert (index) {
            this.alerts.splice(index, 1)
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
        deleteCategory (userId, categoryId) {
            CATEGORIES.deleteOne(userId, categoryId)
            .then(res => {
                for (var i = 0; i < this.categories.length; i++) {
                    if (this.categories[i]._id === categoryId) {
                        this.categories.splice(i, 1)
                    }
                }
            })
            .catch(err => {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: err.response.data })
                window.scrollTo(0,0)
            })
            .finally(() => {})
        },
        editCategory (categoryId) {
            this.$router.push('/edit-category/' + categoryId)
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