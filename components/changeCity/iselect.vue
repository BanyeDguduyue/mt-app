<template>
  <div class="m-iselect">
    <span class="name">按省份选择:</span>
    <el-select v-model="pvalue" placeholder="省份">
      <el-option v-for="item in province" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
    <el-select :disabled="!city.length" v-model="cvalue" placeholder="城市">
      <el-option v-for="item in city" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
    <el-autocomplete v-model="input" :fetch-suggestions="querySearchAsync" placeholder="请输入城市中文或拼音" @select="handleSelect"></el-autocomplete>
  </div>
</template>

<script>
import axios from 'axios';
import lodash from 'lodash';
export default {
  data() {
    return {
      province: [],
      pvalue: '',
      city: [],
      cvalue: '',
      input: '',
      cities:[]
    }
  },
  watch: {
    // 监控省份的变化 变化就执行以下函数
    async pvalue(newPvalue) {
      let { status, data: { city } } = await axios.get(`/geo/province/${newPvalue}`)
      if (status === 200) {
        this.city = city.map(item => {
          return {
            value: item.id,
            label: item.name
          }
        })
        this.cvalue = ''
      }
    }
  },
  async mounted() {
    let { status, data: { province } } = await axios.get('/geo/province')
    if (status == 200) {
      this.province = province.map(item => {
        return {
          value: item.id,
          label: item.name
        }
      })
    }
  },
  methods: {
    // query是搜索的字符串 cb是回调
    querySearchAsync: lodash.debounce(async function (query, cb) {
      if(this.cities.length){
        cb(this.cities.filter(item => item.value.indexOf(query)>-1))
      }else{
        let {status,data:{city}} = await axios.get('/geo/city')
        if(status === 200){
          this.cities = city.map(item => {
            return {
              value:item.name
            }
          })
          cb(this.cities.filter(item => item.value.indexOf(query)>-1))
        }else{
          cb([])
        }
      }
    }, 200),
    handleSelect(item) {
      console.log(item);
      // 选择城市后把vuex的city换成选择后的就OK了
    }
  }
}
</script>

<style lang='scss'>
@import "@/assets/css/changeCity/iselect.scss";
</style>