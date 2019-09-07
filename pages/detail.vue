<template>
  <div class="page-detail">
    <el-row>
      <el-col :span="24">
        <Crumbs :keyword='keyword' :type='type' />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24"> 
        <Summa  :meta='product' />
      </el-col>
    </el-row>
    <el-row style="margin-top:40px;">
      <el-col :span="24">
        <h3 style="font-size:20px;color: #222222">商家团购及优惠</h3>
      </el-col>
    </el-row>
    <!-- 这一项的显示如果有商品图片来判断如果有商品就显示 没有则不显示  -->
    <el-row v-if="canOrder || !login">
      <el-col :span="24">
        <list
          v-if="login"
          :list="list"/>
        <div
          v-else
          class="deal-need-login">
          <img
            src="//p0.meituan.net/codeman/56a7d5abcb5ce3d90fc91195e5b5856911194.png"
            alt="登录查看">
          <span>请登录后查看详细团购优惠</span>
          <el-button
            type="primary"
            round>
            <a href="/login">立即登录</a>
          </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Crumbs from '@/components/detail/crumbs';
import Summa from '@/components/detail/summary';
import List from '@/components/detail/list';
import axios from 'axios'
export default {
  data(){
    return {
      // keyword:'',
      // type:'',
      // product:{},
      login:''
    }
  },
  computed:{
    canOrder(){
      return this.list.filter(item => item.photos.length).length
    }
  },
  components:{
    Crumbs,
    Summa,
    List
  },
  // 这玩意是在服务端执行的  看出来了。。
  async mounted(){
    let {status,data:{login}} = await axios.get('http://127.0.0.1:3000/search/verify')
    if(status == 200){
      this.login = login
    }else{
      this.login = false
    }
  },
  async asyncData(ctx){
    let {keyword,type} = ctx.query
    let {status,data:{product,more:list,login}} = await axios.get('http://127.0.0.1:3000/search/products',{
      params:{
        keyword,
        type,
        city:ctx.store.state.geo.position.city
      }
    })
    if(status == 200){
      return {
        keyword,
        product,
        type,
        list,
      }
    }else{
      return {
        keyword,
        product:{},
        type,
        list:[],
      }
    }
  }
}
</script>

<style lang='scss'>
  @import '@/assets/css/detail/index.scss';
</style>