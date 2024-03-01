<script setup lang="ts">
import {ElContainer,ElHeader, ElFooter,ElMain} from "element-plus";
import TopBar from "./components/TopBar.vue";
</script>

<template>
  <el-container class = "el-container">
    <el-header class="el-header">
      <TopBar />
    </el-header>
    <el-main>

    </el-main>
    <el-footer class="el-footer"></el-footer>
  </el-container>
</template>

<style scoped>
.el-container{
  height: 100%;
  background-color: var(--el-menu-bg-color);
}
.el-header{
  height: 20px;
  background-color: var(--el-color-primary-light-8);
}

.el-footer{
  height: 20px;
  background-color: var(--el-color-primary-light-8);
}

</style>
