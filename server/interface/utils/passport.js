// passport是Nodejs的一个中间键，用于用户名和密码的验证登陆。在项目中我用它来验证后台用户名和密码，但passport更多用在第三方登录，功能强大。
const passport = require('koa-passport')
// 本地验证
const LocalStrategy = require('passport-local')
const UserModel = require('../../dbs/models/users')

// 创建本地策略
passport.use(new LocalStrategy(async function (username, password, done) {
  // 传递名字
  let where = {
    username
  }
  // 通过mongodb数据库查找
  let result = await UserModel.findOne(where)

  // 如果存在结果
  if (result != null) {
    // 如果数据库找到当前的用户的密码和传入的密码一致
    if (result.password === password) {
      // 成功登录
      console.log(result+'->result');
      
      return done(null, result)
    } else {
      // 否则提示密码错误
      return done(null, false, '密码错误')
    }
  } else {
    // 直接在数据库中找不到该用户那么提示用户不存在
    return done(null, false, '用户不存在')
  }
}))

// 序列化和反序列化的对象是session，是将信息存入session，和将信息从session中取出来。（要存入的变量可以是一个String或者Number或Object）

// 序列化ctx.login()触发
// passport.serializeUser(function(user, done) {
//   console.log(1111);
  
//   done(null,user.password)
// })

// // 反序列化 （请求时，session中存在"passport":{"user":"1"}触发）
// passport.deserializeUser(function(user, done) {
//   console.log('反序列化');
  
//   done(null, user.password)
// })
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
})
module.exports = passport