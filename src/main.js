// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

//Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEnvelope, faLock, faSync, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faEnvelope)
library.add(faLock)
library.add(faSync)
library.add(faPlus)

Vue.component('font-awesome-icon', FontAwesomeIcon)

// Select2
import Select2 from 'v-select2-component'
Vue.component('Select2', Select2)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
