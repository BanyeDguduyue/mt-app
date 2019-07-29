<template>
  <el-row :gutter="0" class="m-header">
    <el-col :span="5">
      <geo></geo>
    </el-col>
    <el-col :span="5">
      <user/>
    </el-col>
    <el-col :span="14">
      <Nav></Nav>
    </el-col>
  </el-row>
</template>

<script>
import Geo from "@/components/public/header/geo";
import User from "@/components/public/header/user";
import Nav from "@/components/public/header/nav";
export default {
  components: {
    Geo,
    User,
    Nav
  }
};
</script>

<style lang="scss" scoped>

</style>