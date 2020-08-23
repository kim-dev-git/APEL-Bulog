import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from '../firebase'
import user from './modules/user'
import faxin from './modules/faxin'
import faxout from './modules/faxout'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    navigationMenu: [
      { title: 'Dasbor', icon: 'mdi-view-dashboard', link: '/' },
      { title: 'Fax Masuk', icon: 'mdi-fax', link: '/fax-masuk' },
      { title: 'Fax Keluar', icon: 'mdi-fax', link: '/fax-keluar' },
      { title: 'Nota Intern', icon: 'mdi-note-text', link: '/nota-intern' },
      { title: 'Surat Perintah', icon: 'mdi-mail', link: '/surat-perintah' },
    ],
  },
  mutations: {
  },
  actions: {
    
  },
  modules: {
    user,
    faxin,
    faxout,
  },
})
