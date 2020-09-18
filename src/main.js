import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { auth, messaging } from './firebase'

import './filters/fullDate'
import './filters/dayDate'

Vue.config.productionTip = false

let app
auth.onAuthStateChanged((user) => {
  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }

  if (user) {

    var date = new Date()
    var month = date.getUTCMonth() + 1
    var year = date.getFullYear()
    if(month.length > 1) {
      store.commit('setSelectedMonth', year + '-' + month)
    } else {
      store.commit('setSelectedMonth', year + '-' + '0' + month)
    }

    store.dispatch('user/get', user)
    store.dispatch('mailin/get')
    store.dispatch('mailout/get')
    store.dispatch('faxin/get')
    store.dispatch('faxout/get')
    store.dispatch('internalnotes/get')
  }
})