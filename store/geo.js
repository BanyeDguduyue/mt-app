
const state = () => ({
  position: {
    city: '北京'
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

export default  {
  namespaced: true,
  state,
  mutations,
  actions
}
