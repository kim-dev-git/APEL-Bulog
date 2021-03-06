import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from '../firebase'
import notifications from './modules/notifications'
import user from './modules/user'
import mailin from './modules/mailin'
import mailout from './modules/mailout'
import faxin from './modules/faxin'
import faxout from './modules/faxout'
import internalnotes from './modules/internalnotes'
import warrants from './modules/warrants'
import employmentagreement from './modules/employmentagreement'
import circularletters from './modules/circularletters'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedMonth: null,
    loading: null,
    navigationMenu: [
      { title: 'Dasbor', icon: 'mdi-view-dashboard', link: '/' },
      { title: 'Surat Masuk', icon: 'mdi-email-receive', link: '/surat-masuk' },
      { title: 'Surat Keluar', icon: 'mdi-email-send', link: '/surat-keluar' },
      { title: 'Fax Masuk', icon: 'mdi-fax', link: '/fax-masuk' },
      { title: 'Fax Keluar', icon: 'mdi-fax', link: '/fax-keluar' },
      { title: 'Nota Intern', icon: 'mdi-note-text', link: '/nota-intern' },
      { title: 'Surat Perintah', icon: 'mdi-mail', link: '/surat-perintah' },
      { title: 'Surat Edaran', icon: 'mdi-email-sync', link: '/surat-edaran' },
      { title: 'Perjanjian Kerja', icon: 'mdi-handshake', link: '/perjanjian-kerja' },
    ],
    myDisposition: []
  },
  mutations: {
    setLoading(state, val) {
      state.loading = val
    },
    setSelectedMonth(state, val) {
      state.selectedMonth = val
    },
    setMyDisposition(state, val) {
      state.myDisposition = val
    },
  },
  actions: {
    getDisposition({ state, commit }, position) {
      var myDisposition = null
      var user = state.user.userProfile
      if(user.position === 'TU' || user.position === 'Pimwil') {
        myDisposition = fb.db.collectionGroup('disposition').orderBy("createdAt", "desc")
      } else {
        myDisposition = fb.db.collectionGroup('disposition').where('to', '==', position).orderBy("createdAt", "desc")
      }
      myDisposition.onSnapshot(snapshoot => {
        let array = []

        snapshoot.forEach(doc => {
          let object = doc.data()
          object.id = doc.id

          if(!object.status) {
            array.push(object)
          }
        })

        commit('setMyDisposition', array)
      })
    }
  },
  modules: {
    notifications,
    user,
    mailin,
    mailout,
    faxin,
    faxout,
    internalnotes,
    warrants,
    employmentagreement,
    circularletters,
  },
})
