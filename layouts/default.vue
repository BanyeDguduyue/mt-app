<template>
  <el-container class="layout-default">
    <el-header style="height:auto">
      <my-header></my-header>
    </el-header>
    <el-main>
      <nuxt></nuxt>
    </el-main>
    <el-footer style="height:auto"><my-footer/></el-footer>
  </el-container>
</template>

<script>
import MyHeader from "@/components/public/header/index";
import MyFooter from "@/components/public/footer/index";
export default {
  components: {
    MyHeader,
    MyFooter
  }
};
</script>

<style lang="scss">
@import "@/assets/css/public/layout.scss";
</style>
