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
                            <h5 class="card-title">Add a New Category</h5>
                            <p class="card-text"><router-link :to="{ name: 'CategoryManager' }">Return to Category Manager</router-link></p>
                        </div>
                        <div class="clearfix" style="width: 90%;">
                            <form @submit='addCategory($event)'>
                                <div class="row">
                                    <div class="col-centered">
                                        <div class="form-group">
                                            <label for="name">Category Name</label>
                                            <input type="text" v-model='category.name' id="name" name="name" class="form-control" placeholder="Enter Category Name" required="required" />
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
import CATEGORIES from '@/services/CATEGORIES'

export default {
    data () {
        return {
            alerts: [],
            category: {
                name: ''
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
    },
    methods: {
        closeAlert (index) {
            this.alerts.splice(index, 1)
        },
        async addCategory (evt) {
            evt.preventDefault()
            if (this.category.name === '') {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: 'Category name is a required field' })
                return
            }
            CATEGORIES.add(this.user._id, this.category)
            .then(res => {
                this.$router.push('/category-manager')
            })
            .catch(err => {
                this.alerts.push({ type: 'alert alert-warning alert-dismissible fade show', msg: err.response.data })
                return window.scrollTo(0,0)
            })
            .finally(() => { this.user = {}; this.category = { name: '' }; })
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