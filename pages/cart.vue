<template>
  <div class="page-cart">
    <el-row>
      <el-col :span="24" v-if="cart.length" class="m-cart">
        <List :cart-data='cart'/>
        <p>
          应付金额：<em class="money">￥{{total}}</em>
        </p>
        <div class="post">
          <el-button type="primary" @click="submit">
            提交订单
          </el-button>
        </div>
      </el-col>
      <el-col :span="24" v-else class="empty">购物车为空</el-col>
    </el-row>
  </div>
</template>

<script>
import List from '@/components/cart/list';
import axios from 'axios';
export default {
  components:{
    List
  },
  data(){
    return {
      cart:[]
    }
  },
  methods:{
    async submit(){
      let {status,data:{code,id}} = await axios.post('http://127.0.0.1:3000/order/createOrder',{
        params:{
          count:this.cart[0].count,
          price:this.cart[0].price,
          id:this.cartNo
        }
      })

      if(status === 200&&code === 0){
        this.$alert(`恭喜您，已成功下单请在我的订单中查看，订单号：${id}`,'下单成功',{
          confirmButtonText:'确定',
          callback:action =>  {
            location.href = 'http://127.0.0.1:3000/order'
          }
        })
      }
    }
  },
  computed:{
    total(){
      let total = 0;
      this.cart.forEach(item => {
        total += item.price * item.count
      })
      return total
    }
  },
  async asyncData(ctx){
    let {status,data:{code,data:{name,price}}} = await axios.post('http://127.0.0.1:3000/cart/getCart',{
      params:{
        id:ctx.query.id
      }
    })
    console.log(status,code,name,price);
    
    if(status === 200&&code ===0&&name){
      return{
        cart:[{
          name,
          price,
          count:1
        }],
        cartNo:ctx.query.id
      }
    }
  }
}
</script>

<style lang='scss'>
@import '@/assets/css/cart/index.scss';
</style>