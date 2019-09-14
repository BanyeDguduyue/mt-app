<template>
  <div class="m-geo">
    <i class="el-icon-location"></i>{{city}}
    <nuxt-link class="changeCity" to="/changeCity">切换城市</nuxt-link>
    [天津 平武 北京]
  </div>
</template>

<script>
export default {
  data(){
    return {
      city: ''
    }
  },
  mounted(){
    this.city = window.localStorage.getItem('city') !== null ? window.localStorage.getItem('city').replace('市','') : '北京'
  }
}
</script>

<style lang="scss">

</style>
