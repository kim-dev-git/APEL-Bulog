import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from '../firebase'
import notifications from './modules/notifications'
import user from './modules/user'
import faxin from './modules/faxin'
import faxout from './modules/faxout'
import internalnotes from './modules/internalnotes'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: null,
    navigationMenu: [
      { title: 'Dasbor', icon: 'mdi-view-dashboard', link: '/' },
      { title: 'Fax Masuk', icon: 'mdi-fax', link: '/fax-masuk' },
      { title: 'Fax Keluar', icon: 'mdi-fax', link: '/fax-keluar' },
      { title: 'Nota Intern', icon: 'mdi-note-text', link: '/nota-intern' },
      { title: 'Surat Perintah', icon: 'mdi-mail', link: '/surat-perintah' },
    ],
  },
  mutations: {
    setLoading(state, val) {
      state.loading = val
    },
  },
  actions: {
    
  },
  modules: {
    notifications,
    user,
    faxin,
    faxout,
    internalnotes,
  },
})
