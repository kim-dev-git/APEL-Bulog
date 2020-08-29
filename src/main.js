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

    store.dispatch('user/get', user)
    store.dispatch('mailin/get')
    store.dispatch('mailout/get')
    store.dispatch('faxin/get')
    store.dispatch('faxout/get')
    store.dispatch('internalnotes/get')
  }
})