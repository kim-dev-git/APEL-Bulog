import * as fb from '@/firebase'
import router from '@/router'
// import state from './state'

const END_POINT = 'faxOut'
const ref = fb.db.collection(END_POINT)

const state = {
  collection: [],
  document: null
}

const mutations = {
  setFaxOuts(state, val) {
    state.collection = val
  },
  setFaxOut(state, val) {
    state.document = val
  },
}

const actions = {
  async post({ commit, dispatch }, form) {
    
    commit('setLoading', 'post', { root: true })

    form.status = "Menunggu persetujuan"
    form.createdAt = fb.Timestamp.fromDate(new Date())

    const list = [
      '<b>Klik teks ini</b> untuk mengedit  <i>list</i>, <b>Klik Tambah Data</b> disebelah kanan untuk menambah <i>list </i> baruz'
    ]

    const content = {
      body: '<b>Klik teks ini</b> untuk mengedit isi berita',
      footer: '<b><i>Klik teks</i></b> untuk mengedit penutup',
      list: list
    }

    form.content = content

    await ref.add(form).then(() => {
      dispatch('get')
      commit('setLoading', null, { root: true })
      dispatch('notifications/post', {
        // title: 'Update profil berhasil.',
        body: `Fax berhasil ditambahkan.`,
      }, { root: true })
    }).catch(err => {
      dispatch('notifications/post', {
        title: `Fax gagal ditambahkan.`,
        body: err,
        timeout: 60
      }, { root: true })
      
      commit('setLoading', null, { root: true })
    })

  },
  async get({ commit, state }, id = null) {
    commit('setLoading', 'get', { root: true })

    if(id) {
      state.document = null
      const query = await ref.doc(id).get()
      const object = query.data()
      object.id = id
      commit('setFaxOut', object)

      commit('setLoading', null, { root: true })
    } else {
      const query = await ref.onSnapshot(snapshoot => {
        let array = []

        snapshoot.forEach(doc => {
          let object = doc.data()
          object.id = doc.id

          array.push(object)
        })

        commit('setFaxOuts', array)
        commit('setLoading', null, { root: true })
      })
    }
  },
  async put({ commit, dispatch }, form) {

    commit('setLoading', 'post', { root: true })

    const id = form.id
    delete form.id
    
    form.editedAt = fb.Timestamp.fromDate(new Date())

    await ref.doc(id).set(form, { merge: true }).then(() => {
      dispatch('get', id)
      commit('setLoading', null, { root: true })
      dispatch('notifications/post', {
        // title: 'Update profil berhasil.',
        body: `Fax berhasil diupdate.`,
      }, { root: true })
    }).catch(err => {
      dispatch('notifications/post', {
        title: `Fax gagal diupdate.`,
        body: err,
        timeout: 60
      }, { root: true })
      
      commit('setLoading', null, { root: true })
    })

  },
  async remove({ commit, dispatch }, fax) {
    commit('setLoading', 'post', { root: true })

    await ref.doc(fax.id).delete().then(function() {
      dispatch('get')
      commit('setLoading', null, { root: true })
      dispatch('notifications/post', {
        // title: 'Update profil berhasil.',
        body: `Fax berhasil dihapus.`,
      }, { root: true })
    }).catch(err => {
      commit('setLoading', null, { root: true })
      dispatch('notifications/post', {
        title: 'Gagal menghapus fax.',
        body: `${ err }.`,
      }, { root: true })
    })
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}