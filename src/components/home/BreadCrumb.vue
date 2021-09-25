<template>
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{ firstNav }}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ secondNav }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'BreadCrumb',
  props: {
    firstNav: String,
    secondNav: String
  }
}
</script>

<style scoped>
</style>