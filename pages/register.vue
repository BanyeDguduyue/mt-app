<template>
  <div class="page-register">
    <article class="header">
      <header>
        <a href="/" class="site-logo">
        </a>
        <span class="login">
          <em class="bold">已有美团账号？</em>
          <a href="/login">
            <el-button type="primary" size='small'>登录</el-button>
          </a>
        </span>
      </header>
    </article>
    <section>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="昵称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" type="email"></el-input>
          <el-button size="mini" round @click="sendMsg">发送验证码</el-button>
          <span class="status">{{ statusMsg }}</span>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="ruleForm.code" maxlength="4"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="ruleForm.pwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="cpwd">
          <el-input type="password" v-model="ruleForm.cpwd"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click='register' type="primry">同意以下协议并注册</el-button>
          <div class="error">{{error}}</div>
        </el-form-item>
        <el-form-item>
          <a class="f1" href="http://www.meituan.com/about/terms" target="_blank">《美团网用户协议》</a>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
// 加密
import CryptoJs from 'crypto-js'
// import { __vlsComponentHelper } from '../vue-temp/vue-editor-bridge';
export default {
  layout: 'blank',
  data() {
    return {
      error: '111',
      statusMsg: '',
      ruleForm: {
        name: '',
        code: '',
        pwd: '',
        cpwd: '',
        email: ''
      },
      rules: {
        name: [{
          required: true, type: 'string', message: '请输入昵称', trigger: 'blur'
        }],
        email: [{
          required: true, type: 'email', message: '请输入邮箱', trigger: 'blur'
        }],
        pwd: [{
          required: true, message: '创建密码', trigger: 'blur'
        }],
        cpwd: [{
          required: true, message: '确认密码', trigger: 'blur'
        }, {
          // 前台校验密码和确认密码是否一致
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'))
            } else if (value != this.ruleForm.pwd) {
              callback(new Error('密码与第一次密码不匹配'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    // 注册
    register() {
      const self = this
      this.$refs['ruleForm'].validate((valid)=>{     
        if(valid){
          axios.post('/users/signup',{
            username: window.encodeURIComponent(self.ruleForm.name),
            password: CryptoJs.MD5(self.ruleForm.pwd).toString(),
            email: self.ruleForm.email,
            code: self.ruleForm.code
          }).then(({status,data})=>{
            console.log(status,data);
            
            if(status === 200){
              if(data&&data.code === 0){
                location.href = '/login'
              }else{
                self.error = data.msg
              }
            }else{
              self.error = `服务器出错，${status}`
            }
            // 清空错误信息
            setTimeout(()=>{
              self.error = ''
            },1500)
          })
        }
      })
    },
    // 发送验证码
    sendMsg() {
      // 定向this防止发生变化
      const self = this
      // 定义两个变量来测试所注册的name和email是否符合要求
      let namePass, emailPass
      // 防止多次点击发送验证信息 当定时器为null时或undefined时发送
      if (self.timerid) {
        return false
      }
      console.log(1);
      
      self.$refs['ruleForm'].validateField('email', (valid) => {
        emailPass = valid
      })
      if (!namePass && !emailPass) {
        axios.post('/users/verify', {
          // 防止有中文 把数据传递给后台 之后返回数据
          username: encodeURIComponent(self.ruleForm.name),
          email: self.ruleForm.email
          // 解构赋值
        }).then(({ status, data }) => {
          if (status === 200 && data && data.code === 0) {
            let count = 60
            self.statusMsg = `验证码已发送，剩余${count--}秒`
            self.timerid = setInterval(() => {
              self.statusMsg = `验证码已发送，剩余${count--}秒`
              if(count === -1){
                // 当倒计时到-1时就关闭定时器 并设置为空 设置状态为空
                clearInterval(self.timerid)
                self.timerid = null
                self.statusMsg = ''
              }
            },1000)
          }else{
            // 这里显示如果又错误就显示后台写的错误
            self.statusMsg = data.msg
          }
        })
      }
    }
  }
}
</script>

<style lang='scss'>
@import "@/assets/css/register/index.scss";
</style>
