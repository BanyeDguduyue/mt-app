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
  let province = await Province.find()
  console.log(province);
  
  ctx.body = {
    province: province.map(item => {
      return {
        id: item.id,
        name: item.value
      }
    })
  }
})

router.get('/province/:id',async ctx => {
  let city = await City.findOne({id:ctx.params.id})

  ctx.body = {
    code:0,
    city:city.value.map(item => {
      return {province: item.province,id:item.id,name:item.name}
    })
  }
})

router.get('/city',async ctx => {
  let city = []
  let result = await City.find()
  result.forEach(item => {
    city = city.concat(item.value)
  })

  ctx.body = {
    code:0,
    city: city.map(item => {
      return {
        province: item.province,
        id: item.id,
        name: item.name === '市辖区' || item.name === '省直辖县级行政区划' ? item.province : item.name
      }
    })
  }
})
module.exports = router
