const Router = require('koa-router')
const axios = require('./utils/axios')
const Province = require('../dbs/models/province')
const City = require('../dbs/models/city')
let router = new Router({
  prefix: '/geo'
})


// 获取地理位置接口
router.get('/getPosition', async ctx => {
  let {
    status,
    data: {
      province,
      city
    }
  } = await axios.get(`http://cp-tools.cn/geo/getPosition`)
  if (status === 200) {
    ctx.body = {
      province,
      city
    }
  } else {
    ctx.body = {
      province: '',
      city: ''
    }
  }
})

// 获取首页菜单的接口
router.get('/menu', async ctx => {
  let {
    status,
    data: {
      menu
    }
  } = await axios.get(`http://cp-tools.cn/geo/menu`)
  if (status === 200) {
    ctx.body = {
      menu
    }
  } else {
    ctx.body = {
      menu: []
    }
  }
})

// 获取省份的相关数据
router.get('/province', async ctx => {
  // 获取所有的省份
  let province = await Province.find()

  ctx.body = {
    province: province.map(item => {
      return {
        id: item.id,
        name: item.value
      }
    })
  }
})

// 根据id差省份城市
router.get('/province/:id', async ctx => {
  let city = await City.findOne({
    id: ctx.params.id
  })

  ctx.body = {
    code: 0,
    city: city.value.map(item => {
      return {
        province: item.province,
        id: item.id,
        name: item.name
      }
    })
  }
})

router.get('/city', async ctx => {
  let city = []
  let result = await City.find()
  result.forEach(item => {
    city = city.concat(item.value)
  })

  ctx.body = {
    code: 0,
    city: city.map(item => {
      return {
        province: item.province,
        id: item.id,
        name: item.name === '市辖区' || item.name === '省直辖县级行政区划' ? item.province : item.name
      }
    })
  }
})

router.get('/hotCity', async (ctx) => {
  let list = [
    '北京市',
    '上海市',
    '广州市',
    '深圳市',
    '天津市',
    '西安市',
    '杭州市',
    '南京市',
    '武汉市',
    '成都市'
  ]
  let result = await City.find()
  let nList = []
  result.forEach(item => {
    nList = nList.concat(item.value.filter(k => list.includes(k.name) || list.includes(k.province)))
  })
  ctx.body = {
    hots: nList
  }
  // let {status, data: {
  //     hots
  //   }} = await axios.get(`http://cp-tools.cn/geo/hotCity?sign=${sign}`);
  // if (status === 200) {
  //   ctx.body = {
  //     hots
  //   }
  // } else {
  //   ctx.body = {
  //     hots: []
  //   }
  // }
})
module.exports = router