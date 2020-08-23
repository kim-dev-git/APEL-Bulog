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
  async post({  }, form) {

    form.status = "Menunggu Persetujuan"
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

    await ref.add(form)

  },
  async get({ commit }, id = null) {
    if(id) {
      const query = await ref.doc(id).get()
      const object = query.data()
      object.id = id
      commit('setFaxOut', object)
    } else {
      const query = await ref.onSnapshot(snapshoot => {
        let array = []

        snapshoot.forEach(doc => {
          let object = doc.data()
          object.id = doc.id

          array.push(object)
        })

        commit('setFaxOuts', array)
      })
    }
  },
  async put({  }, form) {

    const id = form.id
    delete form.id

    form.status = "Telah direvisi"
    form.editedAt = fb.Timestamp.fromDate(new Date())

    await ref.doc(id).set(form, { merge: true })

  },
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}