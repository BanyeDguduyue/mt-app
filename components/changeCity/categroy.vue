<template>
  <div class="">
    <dl class="m-categroy">
      <dt>按拼音首字母选择:</dt>
      <dd v-for="item in list" :key="item">
        <a :href='"#city-"+item'>{{item}}</a>
      </dd>
    </dl>
    <dl v-for="item in block" :key="item.title" class="m-categroy-section">
      <dt :id='"city-"+item.title'>{{item.title}}</dt>
      <dd>
        <span v-for="c in item.city" :key="c" @click="handleSelect(c)">
          {{c}}
        </span>
      </dd>
    </dl>
  </div>
</template>

<script>
import axios from 'axios'
import pyjs from 'js-pinyin'
export default {
  data(){
    return {
      list:'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
      block:[]
    }
  },
  methods:{
    handleSelect(item){
      window.localStorage.setItem('city',item)
      window.location.reload()
    }
  },
  async mounted(){
    let blocks=[]
    let {status,data:{city}} = await axios.get('geo/city')
    if(status === 200){
      let p,c,d={}
      // 循环遍历每一项
      city.forEach(item => {
        // 把城市转换成拼音 截取第一个
        p = pyjs.getFullChars(item.name).toLocaleLowerCase().slice(0,1)
        c = p.charCodeAt(0)
        if(c>96&&c<123){
          if(!d[p]){
            d[p] = []
          }
          // 这地方是A:[城市名]这样子的对象
          d[p].push(item.name)
        }
      })
      // 转换成对象的方式
      for(let [k,v] of Object.entries(d)){
        blocks.push({
          title:k.toUpperCase(),
          city:v
        })
      }
      // 排序
      blocks.sort((a,b)=>{
        return a.title.charCodeAt(0)-b.title.charCodeAt(0)
      })
      // 赋值给
      this.block = blocks
    }
  }
}
</script>

<style lang='scss'>
@import '@/assets/css/changeCity/categroy.scss';
</style>