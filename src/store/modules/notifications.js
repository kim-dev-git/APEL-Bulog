const state = {
  notifications: [],
}

const mutations = {
  postNotification(state, notification) {
    state.notifications.push({
      ...notification,
      id: (Math.random().toString(36) + Date.now().toString(36)).substr(2)
    })
  },
  removeNotification(state, notification) {
    var filtered = state.notifications.filter(n => { return n.id != notification.id })
    console.log(filtered)
    state.notifications = filtered
  }
}

const actions = {
  post({ commit }, notification) {
    commit('postNotification', notification)
  },
  remove({ commit }, notification) {
    commit('removeNotification', notification)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
