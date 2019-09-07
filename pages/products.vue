<template>
  <el-row class="page-product">
    <el-col :span='19'>
      <Crumbs :keyword='keyword'></Crumbs>
      <Categroy :types='types' :areas='areas'></Categroy>
      <List :list='list'></List>
    </el-col>
    <el-col :span="5">
      <Amap v-if="point.length" :width='230' :height='290' :point='point'></Amap>
    </el-col>
  </el-row>
</template>

<script>
import Crumbs from '@/components/products/crumbs.vue'
import Categroy from '@/components/products/categroy.vue'
import List from '@/components/products/list.vue'
import Amap from '@/components/public/map'
import axios from 'axios'
export default {
  data() {
    return {
      list: [],
      types: [],
      areas: [],
      keyword: '',
      point: []
    }
  },
  components: {
    Crumbs,
    Categroy,
    List,
    Amap
  },
  async asyncData(ctx) {
    
    
    let keyword = ctx.query.keyword
    let city = ctx.store.state.geo.position.city


    
    let {status,data:{count,pois}} = await axios.get('http://127.0.0.1:3000/search/resultsByKeywords',{
      params:{
        keyword,
        city
      }
    })

    
    let { status: status2, data: { areas, types } } = await axios.get('http://127.0.0.1:3000/categroy/crumbs', {
      params: {
        city
      }
    })

    if (status === 200 && count > 0 && status === 200) {
      return {
        list: pois.filter(item => item.photos.length).map(item => {
          return {
            type: item.type,
            img: item.photos[0].url,
            name: item.name,
            comment: Math.floor(Math.random() * 10000),
            rate: Number(item.biz_ext.rating),
            price: Number(item.biz_ext.cost),
            scene: item.tag,
            tel: item.tel,
            status: '可订明日',
            locataion: item.locataion,
            module: item.type.split(';')[0]
          }
        }),
        keyword,
        areas: areas.filter(item => {item.type !== ''}).slice(0, 5),
        types: types.filter(item => {item.type !== ''}).slice(0, 5),
        point: (pois.find(item => item.location).location || '').split(',')
      }
    }
  }
}
</script>

<style lang='scss'>
@import "@/assets/css/products/index.scss";
</style>