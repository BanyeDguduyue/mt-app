module.exports =  {
  dbs: 'mongodb://127.0.0.1:27017/student',
  redis: {
    get host() {
      return '127.0.0.1'
    },
    get port() {
      return 6379
    }
  },
  smtp: {
    // 设置主机
    get host() {
      return 'smtp.163.com'
    },
    // 设置发送邮件的用户
    get user() {
      return 'l13659022010@163.com'
    },
    // 授权码
    get pass() {
      return 'llyyxx123'
    },
    // 验证码
    get code() {
      return () => {
        return Math.random().toString(16).slice(2, 6).toUpperCase()
      }
    },
    // 过期时间
    get expire() {
      return () => {
        return new Date().getTime() + 60 *  1000
      }
    }
  }
}
