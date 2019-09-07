const Router = require('koa-router')
const Redis = require('koa-redis')
const nodemailer = require('nodemailer')
const User = require('../dbs/models/users')
const Passport = require('./utils/passport')
const Email = require('../dbs/config')
const axios = require('./utils/axios')

// 获取接口都有一个前缀
let router = new Router({
  prefix: '/users'
})

// 连接redis
let Store = new Redis().client

// 注册接口
router.post('/signup', async ctx => {
  // 从数据中解构赋值获取相应的数据
  const {
    username,
    password,
    email,
    code
  } = ctx.request.body

  

  //检测是否存在code验证码
  if (code) {
    // nodemail 发验证码储存存在redis中 然后从redis中获取验证码 
    const saveCode = await Store.hget(`nodemail:${username}`, 'code')

    // nodemail 发验证码的同时 设置过期时间 然后从redis中获取过期时间
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')


    // 验证 输入框的验证码和redis中储存的验证码是否一致
    if (code === saveCode) {
      // 验证时间是否已经过期
      if (new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          code: -1,
          msg: '验证码已过期，请重新尝试'
        }
        return false
      }
    }

    if (code !== saveCode) {
      // 否则验证码错误
      ctx.body = {
        code: -1,
        msg: '请填写正确的验证码'
      }
    }
  }

  // 没有填写验证码则反馈此信息
  if (!code) {
    // 否则请填写验证码
    ctx.body = {
      code: -1,
      msg: '请填写验证码'
    }
    return
  }

  // 在mongodb中查找注册的用户名
  let user = await User.find({
    username
  })

  if (user.length) {
    ctx.body = {
      code: -1,
      msg: '此用户名已被注册'
    }
    return
  } else {
    // 将新用户写入数据库中
    let nuser = await User.create({
      username,
      password,
      email
    })


    if (nuser) {
      
      
      // 跳转到登录页面
      let res = await axios.post('/users/signin', {
        username:username,
        password:password
      })
    
      
      if (res.data && res.data.code === 0) {
        ctx.body = {
          code: 0,
          msg: '注册成功',
          user: res.data.user
        }
      } else {
        ctx.body = {
          code: -1,
          msg: 'error'
        }
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '注册失败'
      }
    }
  }
})


// 登录的接口
router.post('/signin', async (ctx, next) => {
  
  
  // 调用passport的方法
  return Passport.authenticate('local', function (err, user, info, status) {
    if (err) {
      ctx.body = {
        code: -1,
        msg: err
      }
    } else {
      if (user) {
        ctx.body = {
          code: 0,
          msg: '登陆成功',
          user
        }
        //这里调用ctx.login()函数传入的参数要和上文中的序列化函数passport.serializeUser对应
      
        return ctx.login(user)
      } else {
        ctx.body = {
          code: 1,
          msg: info
        }
      }
    }
  })(ctx, next)
})

router.post('/verify', async (ctx, next) => {
  // 获取到输入框的用户名
  let username = ctx.request.body.username
  // 取到过期时间
  const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
  // 防止一直发送验证码 要过期时间存在才能执行
  if (saveExpire && new Date().getTime() - saveExpire < 0) {
    ctx.body = {
      code: -1,
      msg: '验证请求过于频繁'
    }
    return false
  }

  // console.log(Email.smtp.host);

  // 用node发邮件的相关设置
  let transport = nodemailer.createTransport({
    host: Email.smtp.host,
    port: '465',
    secure: true,
    auth: {
      user: Email.smtp.user,
      pass: Email.smtp.pass
    }
  })

  // 生成相关信息 如验证码 过期时间
  let ko = {
    code: Email.smtp.code(),
    expire: Email.smtp.expire(),
    email: ctx.request.body.email,
    user: ctx.request.body.username
  }

  // 邮件内容设置
  let mailOptions = {
    from: `"认证邮件" <${Email.smtp.user}>`,
    to: ko.email,
    subject: '李雨芯版美团注册码',
    html: `您的注册码是${ko.code}`
  }
  

  // 发送邮件
  await transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return 
    } else {
      // redis储存设置相关数据
      
      Store.hmset(`nodemail:${ko.user}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email)
    }
  })

  ctx.body = {
    code: 0,
    msg: '验证码已发送'
  }
})

// 注销退出接口
router.get('/exit', async (ctx, next) => {
  // 执行登出的效果 注销
  await ctx.logout()
  // 二次验证是否注销
  // 检查现在是否是登录状态
  console.log('exit',ctx.isAuthenticated());
  
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: 0,
    }
  } else {
    ctx.body = {
      code: -1
    }
  }
})

// 获取用户名
router.get('/getUser', async ctx => {
  console.log('get',ctx.isAuthenticated());
  if (ctx.isAuthenticated()) {
    const {
      username,
      email
    } = ctx.session.passport.user
    ctx.body = {
      user: username,
      email
    }
  } else {
    ctx.body = {
      user: '',
      email: ''
    }
  }
})

module.exports = router
