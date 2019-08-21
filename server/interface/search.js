const Router = require('koa-router')
const axios = require('./utils/axios')
let router = new Router({
  prefix: '/search'
})

router.get('/top',async ctx => {

})



export default router