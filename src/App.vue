<script setup lang="ts">
import {ElContainer,ElHeader, ElFooter,ElMain} from "element-plus";
import TopBar from "./components/TopBar.vue";
import MainStage from "./components/MainStage/MainStage.vue";

</script>

<template>
  <el-container class = "el-container">
    <el-header class="el-header">
      <TopBar />
    </el-header>
    <el-container class = "main-stage">
      <el-aside>

      </el-aside>
      <el-aside>

      </el-aside>
      <el-main>
        <MainStage />
      </el-main>
    </el-container>
    <el-footer class="el-footer"></el-footer>
  </el-container>
</template>

<style scoped lang="scss">
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
.el-main{
  background-color: var(--el-menu-bg-color);
}
.main-stage{
  background-color: var(--el-menu-bg-color);
  border-color: var(--el-color-primary-light-8);
  .el-aside{
    background-color: var(--el-menu-bg-color);
    border-style: none solid;
    border-color: var(--el-color-primary-light-8);
    margin: 0 1px;
    width: 200px;
  }
  .el-main{
    margin: 0;
    padding: 0;
  }
}
</style>
