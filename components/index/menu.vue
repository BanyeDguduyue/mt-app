<template>
  <div class="m-menu">
    <dl class="nav" @mouseleave="menumouseleave">
      <dt>全部分类</dt>
      <dd v-for="(item,idx) in menu" :key="idx"  @mouseenter="menumouseenter">
        <i :class="item.type"></i>
        {{item.name}}<span class="arrow"></span>
      </dd>
    </dl>

    <div class="detail" v-if="kind" @mouseenter='submeunenter' @mouseleave='submenuleave'>
      <template v-for="(item,idx) in curdetail.child">
        <h4 :key="idx">{{item.title}}</h4>
        <span v-for="v in item.child" :key="v">{{v}}</span>
      </template>
    </div>
  </div>
</template>

<script>
import Menu from '@/components/index/menu'
export default {
  computed:{
    curdetail(){ 
      return this.$store.state.home.menu.filter(item => item.type == this.kind)[0]
    }
  },
  components: {
    Menu
  },
  methods:{
    menumouseenter(e){
      this.kind = e.target.querySelector('i').className
    },
    menumouseleave(){
      this.timer = setTimeout(()=>{
        this.kind = ''
      },200)
    },
    submeunenter(){
      clearTimeout(this.timer)
    },
    submenuleave(){
      this.timer = setTimeout(()=>{
        this.kind = ''
      },200)
    }
  },
  data() {
    return {
      kind:'',
      menu:this.$store.state.home.menu
    }
  }
}
</script>

<style>
</style>
