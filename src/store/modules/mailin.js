import * as fb from '@/firebase'

const END_POINT = 'mailIn'
const ref = fb.db.collection(END_POINT)

const state = {
  collection: [],
  document: null,
  disposition: []
}

const getters = {
  collection(state, getters, rootState) {
    if(!rootState.user.userProfile.position) {
      return
    }
    const user = rootState.user.userProfile
    if(user.position !== 'TU' && user.position !== 'Pimwil') {
      return state.collection.filter(item => item.tag && item.tag.includes(user.position))
    } else {
      return state.collection
    }
  }
}

const mutations = {
  setMailIns(state, val) {
    state.collection = val
  },
  setMailIn(state, val) {
    state.document = null
    state.document = val
  },
  setMailInDisposition(state, val) {
    state.disposition = val
  },
}

const actions = {
  async post({ commit, dispatch }, form) {
    commit('setLoading', 'post', { root: true })
    const { id } = await ref.doc()
    delete form.id
    delete form.fileURL
    delete form.fileExt

    if(form.file){
      var file = form.file
      var storageRef = await fb.storage.ref('mail-in/' + id + '.' + file.name.split('.').pop());
      var task = storageRef.put(file)
      task.on('state_changed', snapshot => {
        var percentage = ((snapshot.bytesTransferred/snapshot.totalBytes)*100).toFixed(0)
        dispatch('notifications/post', {
          // title: 'Sedang mengupload file.',
          body: `Proses upload ${ percentage }%.`,
          timeout: 1
        }, { root: true })
        // console.log('Upload is ' + percentage + '% done');

      }, err => {
        dispatch('notifications/post', {
          title: `Upload file gagal.`,
          body: err,
          timeout: 60
        }, { root: true })

        commit('setLoading', null, { root: true })

      }, async () => {
        await task.snapshot.ref.getDownloadURL().then(async downloadURL => {
          dispatch('notifications/post', {
            // title: 'Update profil berhasil.',
            body: `Upload file berhasil.`,
          }, { root: true })
          form.fileURL = downloadURL
          form.fileExt = file.name.split('.').pop()
          delete form.file

          form.status = "Baru masuk"
          form.createdAt = fb.Timestamp.fromDate(new Date())
          
          await ref.doc(id).set(form).then(() => {
            // dispatch('get')
            commit('setLoading', null, { root: true })
            dispatch('notifications/post', {
              // title: 'Update profil berhasil.',
              body: `Surat berhasil ditambahkan.`,
            }, { root: true })
          }).catch(err => {
            dispatch('notifications/post', {
              title: `Surat gagal ditambahkan.`,
              body: err,
              timeout: 60
            }, { root: true })
            
            commit('setLoading', null, { root: true })
          })
        })
      })
    }

    

  },
  async get({ commit }, id = null) {
    if(id) {
      const query = await ref.doc(id).get()
      const object = query.data()
      object.id = id
      commit('setMailIn', object)

      const subQuery = await ref.doc(id).collection('disposition').onSnapshot(snapshoot => {
        let array = []

        snapshoot.forEach(doc => {
          let object = doc.data()
          object.id = doc.id

          array.push(object)
        })

        commit('setMailInDisposition', array)
      })
    } else {
      const query = await ref.onSnapshot(snapshoot => {
        let array = []

        snapshoot.forEach(doc => {
          let object = doc.data()
          object.id = doc.id

          const subQuery = ref.doc(doc.id).collection('disposition').onSnapshot(snapshoot => {
            let tag = []
    
            snapshoot.forEach(doc => {
              let subObject = doc.data()
              subObject.id = doc.id
    
              tag.push(subObject.to)
            })

            object.tag = tag
          })
          
          array.push(object)
        })

        commit('setMailIns', array)
      })
    }
  },
  async put({ commit, dispatch }, form) {
    commit('setLoading', 'post', { root: true })
    const id = form.id

    delete form.tag

    if(form.file){
      var file = form.file

      var storageRef = await fb.storage.ref('mail-in/' + id + '.' + file.name.split('.').pop())
      var task = storageRef.put(file)
      task.on('state_changed', snapshot => {
        var percentage = ((snapshot.bytesTransferred/snapshot.totalBytes)*100).toFixed(0)
        dispatch('notifications/post', {
          // title: 'Sedang mengupload file.',
          body: `Proses upload ${ percentage }%.`,
          timeout: 1
        }, { root: true })
        // console.log('Upload is ' + percentage + '% done');

      }, err => {
        dispatch('notifications/post', {
          title: `Upload file gagal.`,
          body: err,
          timeout: 60
        }, { root: true })

        commit('setLoading', null, { root: true })

      }, async () => {
        await task.snapshot.ref.getDownloadURL().then(async downloadURL => {
          dispatch('notifications/post', {
            // title: 'Update profil berhasil.',
            body: `Upload file berhasil.`,
          }, { root: true })
          form.fileExt = file.name.split('.').pop()
          form.fileURL = downloadURL
          delete form.file

          form.status = "Telah diedit"
          form.editedAt = fb.Timestamp.fromDate(new Date())
          
          await ref.doc(id).set(form, { merge: true }).then(() => {
            // dispatch('get')
            commit('setLoading', null, { root: true })
            dispatch('notifications/post', {
              // title: 'Update profil berhasil.',
              body: `Surat berhasil diupdate.`,
            }, { root: true })
          }).catch(err => {
            dispatch('notifications/post', {
              title: `Surat gagal diupdate.`,
              body: err,
              timeout: 60
            }, { root: true })
            
            commit('setLoading', null, { root: true })
          })
        })
      })
    } else {
      form.status = "Telah diedit"
      form.editedAt = fb.Timestamp.fromDate(new Date())
      
      await ref.doc(id).set(form, { merge: true }).then(() => {
        dispatch('get')
        commit('setLoading', null, { root: true })
        dispatch('notifications/post', {
          // title: 'Update profil berhasil.',
          body: `Surat berhasil diupdate.`,
        }, { root: true })
      }).catch(err => {
        dispatch('notifications/post', {
          title: `Surat gagal diupdate.`,
          body: err,
          timeout: 60
        }, { root: true })
        
        commit('setLoading', null, { root: true })
      })
    }

    

  },
  async remove({ commit, dispatch }, mail) {
    commit('setLoading', 'post', { root: true })

    await ref.doc(mail.id).delete().then(function() {
      if(mail.fileURL) {
        var storageRef = fb.storage.ref('mail-in/' + mail.id + '.' + mail.fileExt)
        storageRef.delete()
      }
      // dispatch('get')
      commit('setLoading', null, { root: true })
      dispatch('notifications/post', {
        // title: 'Update profil berhasil.',
        body: `Surat berhasil dihapus.`,
      }, { root: true })
    }).catch(err => {
      commit('setLoading', null, { root: true })
      dispatch('notifications/post', {
        title: 'Gagal menghapus surat.',
        body: `${ err }.`,
      }, { root: true })
    })
  },

  async postDisposition({ commit, dispatch }, { id, form }) {
    commit('setLoading', 'post', { root: true })

    form.createdAt = fb.Timestamp.fromDate(new Date())
          
    await ref.doc(id).collection('disposition').add(form).then(() => {
      dispatch('get')
      commit('setLoading', null, { root: true })
      dispatch('notifications/post', {
        // title: 'Update profil berhasil.',
        body: `Disposisi berhasil ditambahkan.`,
      }, { root: true })
    }).catch(err => {
      dispatch('notifications/post', {
        title: `Disposisi gagal ditambahkan.`,
        body: err,
        timeout: 60
      }, { root: true })
      
      commit('setLoading', null, { root: true })
    })

  },
  async removeDisposition({ commit, dispatch }, { id, data }) {
    commit('setLoading', 'post', { root: true })

    await ref.doc(id).collection('disposition').doc(data.id).delete().then(function() {
      dispatch('get')
      commit('setLoading', null, { root: true })
      dispatch('notifications/post', {
        // title: 'Update profil berhasil.',
        body: `Disposisi berhasil dihapus.`,
      }, { root: true })
    }).catch(err => {
      commit('setLoading', null, { root: true })
      dispatch('notifications/post', {
        title: 'Gagal menghapus disposisi.',
        body: `${ err }.`,
      }, { root: true })
    })
  },
}


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}