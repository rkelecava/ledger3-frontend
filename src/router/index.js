import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Register from '@/components/Register'
import Login from '@/components/Login'
import RequestPasswordReset from '@/components/RequestPasswordReset'
import ResetPassword from '@/components/ResetPassword'
import AccountManager from '@/components/AccountManager'
import AddAccount from '@/components/AddAccount'
import EditAccount from '@/components/EditAccount'
import CategoryManager from '@/components/CategoryManager'
import AddCategory from '@/components/AddCategory'
import EditCategory from '@/components/EditCategory'
import Entries from '@/components/Entries'
import AddEntry from '@/components/AddEntry'
import EditEntry from '@/components/EditEntry'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/request-password-reset',
      name: 'RequestPasswordReset',
      component: RequestPasswordReset
    },
    {
      path: '/reset-password/:id',
      name: 'ResetPassword',
      component: ResetPassword
    },
    {
      path: '/account-manager',
      name: 'AccountManager',
      component: AccountManager
    },
    {
      path: '/add-account',
      name: 'AddAccount',
      component: AddAccount
    },
    {
      path: '/edit-account/:id',
      name: 'EditAccount',
      component: EditAccount
    },
    {
      path: '/category-manager',
      name: 'CategoryManager',
      component: CategoryManager
    },
    {
      path: '/add-category',
      name: 'AddCategory',
      component: AddCategory
    },
    {
      path: '/edit-category/:id',
      name: 'EditCategory',
      component: EditCategory
    },
    {
      path: '/entries/:id',
      name: 'Entries',
      component: Entries
    },
    {
      path: '/add-entry/:id',
      name: 'AddEntry',
      component: AddEntry
    },
    {
      path: '/edit-entry/:accountId/:entryId',
      name: 'EditEntry',
      component: EditEntry
    }
  ]
})
