const state = () => ({
  menu:[],
  hotPlace:[]
})

const mutations = {
  setMenu(state, val) {
    state.menu = val
  },
  setHotPlace(state, val) {
    state.hotPlace = val
  }
}

const actions = {
  setMenu: ({
    commit
  }, menu) => {
    commit('setMeun', menu)
  },
  setHotPlace: ({
    commit
  }, hotPlace) => {
    commit('setMeun', hotPlace)
  }
}

module.exports = {
  namespaced: true,
  state,
  mutations,
  actions
}
