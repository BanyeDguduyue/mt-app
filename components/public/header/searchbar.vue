<template>
  <div class="search-panel">
    <el-row class="m-header-searchbar">
      <el-col :span="3" class="left">
        <img src="https://s0.meituan.net/bs/fe-web-meituan/2fecdcf/img/logo.png" alt="">
      </el-col>
      <el-col :span="15" class="center">
        <div class="wrapper">
          <el-input @input="input" v-model="search" @focus="inputFocus" @blur="inputBlur" placeholder="搜索商店或地点"></el-input>
          <button class="el-button el-button-primary"><i class="el-icon-search"></i></button>
          <dl class="hotPlace" v-if="isHotPlace">
            <dt>热门搜索</dt>
            <dd v-for="item in hotPlace" :key="item">{{item.name}}</dd>
          </dl>
          <dl class="searchList" v-if="isSearchList">
            <dd v-for="(item,idx) in searchList" :key="idx">{{item.name}}</dd>
          </dl>

        </div>
        <p class="suggest">
          <a href="#">故宫博物院</a>
          <a href="#">故宫博物院</a>
          <a href="#">故宫博物院</a>
          <a href="#">故宫博物院</a>
          <a href="#">故宫博物院</a>
        </p>
        <ul class="nav">
          <li>
            <nuxt-link to="/" class="takeout">
              美团外卖
            </nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="movie">
              猫眼电影
            </nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="hotel">
              美团酒店
            </nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="apartment">
              民宿/公寓
            </nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="business">
              商家入驻
            </nuxt-link>
          </li>
        </ul>
      </el-col>
      <el-col :span="6" class="right">
        <ul class="security">
          <li>
            <i class="refund">
              <p class="txt">随时退</p>
            </i>
          </li>
          <li>
            <i class="single">
              <p class="txt">不满意免单</p>
            </i>
          </li>
          <li>
            <i class="overdue">
              <p class="txt">过期退</p>
            </i>
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import lodash from 'lodash'
import axios from 'axios'
export default {
  data(){
    return {
      search:'',
      isFocus: false,
      searchList:[],
      hotPlace:this.$store.state.home.hotPlace.slice(0,5)
    }
  },
  computed:{
    isHotPlace(){
      return !this.search&&this.isFocus
    },
    isSearchList(){
      return this.search&&this.isFocus
    }
  },
  methods:{
    inputFocus(){
      this.isFocus = true
    },
    inputBlur(){
      setTimeout(()=>{
        this.isFocus = false
      },200)
    },
    input:lodash.debounce(async function(){
      let _this = this
      let city = this.$store.state.geo.position.city.replace('市','')
      this.searchList = []
      let {status,data:{top}} = await axios.get('/search/top',{
        params:{
          input:this.search,
          city
        }
      })
      // 截取10条信息以免太多
      this.searchList = top.slice(0,10)
    })
  }
}
</script>
