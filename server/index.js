const Koa = require('koa')
const consola = require('consola')
const {
  Nuxt,
  Builder
} = require('nuxt')
const mongoose = require('mongoose')
const bodyParser = require('koa-bodyparser')
const session = require('koa-generic-session')
const Redis = require('koa-redis')
// json格式美化
const json = require('koa-json')

const dbConfig = require('./dbs/config')
const passport = require('./interface/utils/passport')
const users = require('./interface/users')
const geo = require('./interface/geo')
const search = require('./interface/search')
const categroy = require('./interface/categroy')
const cart = require('./interface/cart')
const order = require('./interface/order.js')
const app = new Koa()

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'
// app.keys 用于加密
app.keys = ['mt', 'keyskeys']
// 代理
app.proxy = true

// 配置session
app.use(session({
  key: 'mt',
  prefix: 'mt:uid',
  store: new Redis()
}))

app.use(bodyParser({
  extendTypes: ['json', 'form', 'text']
}))

app.use(json())

// 链接数据库
// console.log(dbConfig);

mongoose.connect(dbConfig.dbs, {
  useNewUrlParser: true
})

app.use(passport.initialize())
app.use(passport.session())

app.use(users.routes()).use(users.allowedMethods())
app.use(geo.routes()).use(geo.allowedMethods())
app.use(search.routes()).use(search.allowedMethods())
app.use(categroy.routes()).use(categroy.allowedMethods())
app.use(cart.routes()).use(cart.allowedMethods())
app.use(order.routes()).use(order.allowedMethods())
async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)
  const {
    host = '0.0.0.0',
      port = process.env.PORT || 3000
  } = nuxt.options.server
  console.log(host,port);
  
  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()

//哈哈哈哈哈