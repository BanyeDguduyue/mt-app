
const axios = require('@/server/interface/utils/axios')
const storage = require('store2')
console.log(storage.get('city'));

export const state = () => ({

})

export const mutations = {
  changecity(state,city){

  }
}

export const actions = {
  async nuxtServerInit({
    commit
  }, {
    req,
    app
  }) {
    // const {
    //   status,
    //   data: {
    //     province,
    //     city
    //   }
    // } = await axios.get('/geo/getPosition')

    // 触发modules中geo的action的setPosition函数 如果状态为200成功 就把获取的city province传递过去
    // const city2 = await storage.get('city')
    // console.log(city2);
    
    // commit('geo/setPosition', {
    //   city:city2
    // })
    
    const {status:status2,data:{menu}} = await axios.get('geo/menu')
    commit('home/setMenu',status2 === 200 ? menu:[])

    const {status:status3,data:{result}} = await axios.get('/search/hotPlace',{
      params:{
        city: app.store.state.geo.position.city.replace('市','') || '北京'
      }
    })
    commit('home/setHotPlace',status3 === 200?result:[])
  }
}
