<template>
  <div class="m-hcity">
    <dl>
      <dt>热门城市:</dt>
      <dd v-for="item in list" :key="item.id" @click="handleSelect(item.name === '市辖区'? item.province:item.name)">{{item.name === '市辖区'? item.province:item.name}}</dd>
    </dl>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      list: []
    }
  },
  methods: {
    handleSelect(item) {
      console.log(item);
      window.localStorage.setItem('city', item)
      window.location.reload()
    }
  },
  async mounted() {
    let { status, data: { hots } } = await axios.get('geo/hotCity')
    if (status === 200) {
      this.list = hots
    }
  },

}
</script>

<style lang='scss'>
@import "@/assets/css/changeCity/hot.scss";
</style>