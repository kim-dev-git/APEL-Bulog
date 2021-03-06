import * as fb from '@/firebase'

const END_POINT = 'internalNotes'
const ref = fb.db.collection(END_POINT)
const Timestamp = fb.Timestamp

const state = {
  collection: [],
  document: null,
  disposition: []
}

const mutations = {
  setInternalNotes(state, val) {
    state.collection = val
  },
  setInternalNote(state, val) {
    state.document = val
  },
  setInternalNoteDisposition(state, val) {
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
      var storageRef = await fb.storage.ref('internal-notes/' + id + '.' + file.name.split('.').pop());
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
            dispatch('get')
            commit('setLoading', null, { root: true })
            dispatch('notifications/post', {
              // title: 'Update profil berhasil.',
              body: `Nota intern berhasil ditambahkan.`,
            }, { root: true })
          }).catch(err => {
            dispatch('notifications/post', {
              title: `Nota intern gagal ditambahkan.`,
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
      commit('setInternalNote', object)

      const subQuery = await ref.doc(id).collection('disposition').onSnapshot(snapshoot => {
        let array = []

        snapshoot.forEach(doc => {
          let object = doc.data()
          object.id = doc.id

          array.push(object)
        })

        commit('setInternalNoteDisposition', array)
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

        commit('setInternalNotes', array)
      })
    }
  },
  async put({ commit, dispatch }, form) {
    commit('setLoading', 'post', { root: true })
    const id = form.id

    if(form.file){
      var file = form.file

      var storageRef = await fb.storage.ref('internal-notes/' + id + '.' + file.name.split('.').pop())
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
            dispatch('get')
            commit('setLoading', null, { root: true })
            dispatch('notifications/post', {
              // title: 'Update profil berhasil.',
              body: `Nota intern berhasil diupdate.`,
            }, { root: true })
          }).catch(err => {
            dispatch('notifications/post', {
              title: `Nota intern gagal diupdate.`,
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
          body: `Nota intern berhasil diupdate.`,
        }, { root: true })
      }).catch(err => {
        dispatch('notifications/post', {
          title: `Nota intern gagal diupdate.`,
          body: err,
          timeout: 60
        }, { root: true })
        
        commit('setLoading', null, { root: true })
      })
    }

    

  },
  async remove({ commit, dispatch }, fax) {
    commit('setLoading', 'post', { root: true })

    await ref.doc(fax.id).delete().then(function() {
      if(fax.fileURL) {
        var storageRef = fb.storage.ref('internal-notes/' + fax.id + '.' + fax.fileExt)
        storageRef.delete()
      }
      dispatch('get')
      commit('setLoading', null, { root: true })
      dispatch('notifications/post', {
        // title: 'Update profil berhasil.',
        body: `Nota intern berhasil dihapus.`,
      }, { root: true })
    }).catch(err => {
      commit('setLoading', null, { root: true })
      dispatch('notifications/post', {
        title: 'Gagal menghapus fax.',
        body: `${ err }.`,
      }, { root: true })
    })
  },

  async postDisposition({ commit, dispatch }, { id, form, document }) {
    commit('setLoading', 'post', { root: true })

    form.document = document
    form.createdAt = Timestamp.fromDate(new Date())
          
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
  async doneDisposition({ commit, dispatch }, { id, form }) {
    commit('setLoading', 'post', { root: true })

    form.document = document

    await ref.doc(id).collection('disposition').doc(form.id).set(
      { 
        status: 'Sudah ditindak lanjuti',
        doneAt: Timestamp.fromDate(new Date())
      }, { merge: true }).then(() => {
      dispatch('get', id)
      commit('setLoading', null, { root: true })
      dispatch('notifications/post', {
        // title: 'Update profil berhasil.',
        body: `Disposisi sudah ditindak lanjuti.`,
      }, { root: true })
    }).catch(err => {
      dispatch('notifications/post', {
        title: `Disposisi gagal ditindak lanjuti.`,
        body: err,
        timeout: 60
      }, { root: true })
      
      commit('setLoading', null, { root: true })
    })

  },
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}