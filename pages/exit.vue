<template>
  <div class=""/>
</template>

<script>
import axios from 'axios'
export default {
  layout: 'blank',
  async mounted(){
    let {status, data} = await axios.get("http://127.0.0.1:3000/users/exit")
    if(status === 200 && data && data.code === 0) {
      window.location.href = "/"
    }
  }
}
</script>
