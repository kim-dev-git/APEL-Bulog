import * as fb from '@/firebase'
import router from '@/router'
// import state from './state'

const END_POINT = 'users'
const ref = fb.db.collection(END_POINT)

const state = {
  userProfile: {}
}

const mutations = {
  setUserProfile(state, val) {
    state.userProfile = val
  }
}

const actions = {
  async signin({ dispatch }, form) {

    const { user } = await fb.auth.signInWithEmailAndPassword(form.username + '@gmail.com', form.password).catch(error => {
      
      var errorCode = error.code
      var errorMessage = error.message

      switch(errorCode) {
        case 'auth/wrong-password':
          errorMessage = 'Password salah'
          break
        case 'auth/invalid-email':
          errorMessage = 'Username tidak valid'
          break
        case 'auth/user-disabled':
          errorMessage = 'Username telah dibekukan'
          break
        case 'auth/user-not-found':
          errorMessage = 'Username tidak terdaftar'
          break
        default:
          break
      }

      dispatch('notifications/post', {
        title: 'Login Gagal.',
        body: `${ errorMessage }.`,
        timeout: 60
      }, { root: true })

      return
      
    })
    dispatch('get', user)
  },
  async signup({ dispatch }, form) {
    const { user } = await fb.auth.createUserWithEmailAndPassword(form.username + '@gmail.com', form.password)
  
    await ref.doc(user.uid).set({
      username: form.username,
      position: form.position
    })
    dispatch('get', user)
  },
  async signout({ commit }) {
    await fb.auth.signOut()
  
    commit('setUserProfile', {})
    router.push('/masuk')
  },
  async get({ commit, dispatch }, user) {
    commit('setLoading', 'get', { root: true })

    const userProfile = await ref.doc(user.uid).get()

    commit('setUserProfile', userProfile.data())

    const position = userProfile.data().position

    dispatch('getDisposition', position, { root: true })
    
    commit('setLoading', null, { root: true })

    const currentRoute = router.history.current.path

    if(currentRoute === '/masuk' || currentRoute === '/daftar') {
      router.push('/')
    }
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}