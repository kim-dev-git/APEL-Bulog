import { db, Timestamp, storage} from '@/firebase'

const END_POINT = 'circularLetter'
const ref = db.collection(END_POINT)

const state = {
  collection: [],
  document: null,
  disposition: []
}

const mutations = {
  setCircularLetters(state, val) {
    state.collection = val
  },
  setCircularLetter(state, val) {
    state.document = val
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
      var storageRef = await storage.ref('circular-letter/' + id + '.' + file.name.split('.').pop());
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
          form.createdAt = Timestamp.fromDate(new Date())
          
          await ref.doc(id).set(form).then(() => {
            dispatch('get')
            commit('setLoading', null, { root: true })
            dispatch('notifications/post', {
              // title: 'Update profil berhasil.',
              body: `Surat Edaran berhasil ditambahkan.`,
            }, { root: true })
          }).catch(err => {
            dispatch('notifications/post', {
              title: `Surat Edaran gagal ditambahkan.`,
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
      commit('setCircularLetter', object)
    } else {
      const query = await ref.onSnapshot(snapshoot => {
        let array = []

        snapshoot.forEach(doc => {
          let object = doc.data()
          object.id = doc.id

          array.push(object)
        })

        commit('setCircularLetters', array)
      })
    }
  },
  async put({ commit, dispatch }, form) {
    commit('setLoading', 'post', { root: true })
    const id = form.id

    if(form.file){
      var file = form.file

      var storageRef = await storage.ref('circular-letter/' + id + '.' + file.name.split('.').pop())
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
          form.editedAt = Timestamp.fromDate(new Date())
          
          await ref.doc(id).set(form, { merge: true }).then(() => {
            dispatch('get')
            commit('setLoading', null, { root: true })
            dispatch('notifications/post', {
              // title: 'Update profil berhasil.',
              body: `Surat Edaran berhasil diupdate.`,
            }, { root: true })
          }).catch(err => {
            dispatch('notifications/post', {
              title: `Surat Edaran gagal diupdate.`,
              body: err,
              timeout: 60
            }, { root: true })
            
            commit('setLoading', null, { root: true })
          })
        })
      })
    } else {
      form.status = "Telah diedit"
      form.editedAt = Timestamp.fromDate(new Date())
      
      await ref.doc(id).set(form, { merge: true }).then(() => {
        dispatch('get')
        commit('setLoading', null, { root: true })
        dispatch('notifications/post', {
          // title: 'Update profil berhasil.',
          body: `Surat Edaran berhasil diupdate.`,
        }, { root: true })
      }).catch(err => {
        dispatch('notifications/post', {
          title: `Surat Edaran gagal diupdate.`,
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
        var storageRef = storage.ref('circular-letter/' + fax.id + '.' + fax.fileExt)
        storageRef.delete()
      }
      dispatch('get')
      commit('setLoading', null, { root: true })
      dispatch('notifications/post', {
        // title: 'Update profil berhasil.',
        body: `Surat Edaran berhasil dihapus.`,
      }, { root: true })
    }).catch(err => {
      commit('setLoading', null, { root: true })
      dispatch('notifications/post', {
        title: 'Gagal menghapus fax.',
        body: `${ err }.`,
      }, { root: true })
    })
  },
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}