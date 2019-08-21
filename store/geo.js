const state = () => ({
  position: {
    city:''
  }
})

const mutations = {
  setPosition(state, val) {
    state.position = val
  }
}

const actions = {
  setPositon: ({
    commit
  }, position) => {
    commit('setPosition', position)
  }
}

module.exports = {
  namespaced: true,
  state,
  mutations,
  actions
}
