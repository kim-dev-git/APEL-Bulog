import * as fb from '@/firebase'
import router from '@/router'
// import state from './state'

const END_POINT = 'faxIn'
const ref = fb.db.collection(END_POINT)

const state = {
  collection: [],
  document: null
}

const mutations = {
  setFaxIns(state, val) {
    state.collection = val
  },
  setFaxIn(state, val) {
    state.document = val
  },
}

const actions = {
  async post({  }, form) {

    form.status = "Belum Dibaca"
    form.createdAt = fb.Timestamp.fromDate(new Date())

    await ref.add(form)

  },
  async get({ commit }, id = null) {
    if(id) {
      const query = await ref.doc(id).get()
      const object = query.data()
      object.id = id
      commit('setFaxIn', object)
    } else {
      const query = await ref.onSnapshot(snapshoot => {
        let array = []

        snapshoot.forEach(doc => {
          let object = doc.data()
          object.id = doc.id

          array.push(object)
        })

        commit('setFaxIns', array)
      })
    }
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}