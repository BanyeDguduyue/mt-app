const axios = require('@/server/interface/utils/axios')

export const state = () => ({

})

export const mutations = {

}

export const actions = {
  async nuxtServerInit({
    commit
  }, {
    req,
    app
  }) {
    const {
      status,
      data: {
        province,
        city
      }
    } = await axios.get('/geo/getPosition')

    // 触发modules中geo的action的setPosition函数 如果状态为200成功 就把获取的city province传递过去
    commit('geo/setPosition', status === 200 ? {
      city,
      province
    } : {
      city: '',
      province: ''
    })

    const {status:status2,data:{menu}} = await axios.get('geo/menu')
    commit('home/setMenu',status2 === 200 ? menu:[])
  }
}
