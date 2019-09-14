<template>
  <el-row class="page-order">
    <el-col :span='4' class="navbar">
      <h3>我的美团</h3>
      <dl>
        <dt>我的订单</dt>
        <dd>全部订单<i class="el-icon-arrow-right"></i></dd>
        <dd>待付款<i class="el-icon-arrow-right"></i></dd>
        <dd>待使用<i class="el-icon-arrow-right"></i></dd>
      </dl>
      <dl>
        <dt>我的收藏</dt>
        <dd>收藏的商家<i class="el-icon-arrow-right"></i></dd>
        <dd>收藏的团购<i class="el-icon-arrow-right"></i></dd>
      </dl>
      <dl>
        <dt>抵用券</dt>
        <dd>可用券<i class="el-icon-arrow-right"></i></dd>
        <dd>失效券<i class="el-icon-arrow-right"></i></dd>
      </dl>
      <dl>
        <dt>个人信息</dt>
        <dd>用户设置<i class="el-icon-arrow-right"></i></dd>
      </dl>
    </el-col>
    <el-col :span="19" class="table">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部订单" name="all">
          <list :cur="cur"></list>
        </el-tab-pane>
        <el-tab-pane label="待付款" name="unpay">
          <list :cur="cur"></list>
        </el-tab-pane>
        <el-tab-pane label="待使用" name="unuse">
          <list :cur="cur"></list>
        </el-tab-pane>
        <el-tab-pane label="待评价" name="unreplay">
          <list :cur="cur"></list>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>

<script>
import List from '@/components/order/list';
import axios from 'axios';
export default {
  data(){
    return {
      activeName:'all',
      list:[],
      cur:[]
    }
  },
  components:{
    List
  },
  watch: {
    activeName(val){
      this.cur = this.list.filter(item => {
        if(val === 'unpay'){
          return item.status === 0
        } else if(val === 'all'){
          return true
        }else{
          return false
        }
      })
    },
    list(){
      let val = this.activeName
      this.cur = this.list.filter(item => {
        if(val == 'unpay'){
          return item.status === 0
        }else if(val === 'all'){
          return true
        }else{
          return false
        }
      })
    }
  },
  methods:{
    handleClick(tab){
      this.activeName = tab.name  
    }
  },
  async created(){
    console.log(1);
    
    // 要改动需要增加用户参数不然会返回所有的商品
    let {status,data:{code,list}} = await axios.post('http://127.0.0.1:3000/order/getOrders')
    console.log(code,list);
    
    if(status === 200 && code === 0 && list.length){
      this.list = this.cur =
        list.map(item => {
          return {
            img: item.imgs.length? item.imgs[0].url:'/logo.png',
            name:item.name,
            count:1,
            total:item.total,
            status:item.status,
            statusTxt:item.status === 0 ?'待付款':'已付款'
          }
        })
    }
  }
}
</script>

<style lang='scss'>
@import "@/assets/css/order/index.scss";
</style>