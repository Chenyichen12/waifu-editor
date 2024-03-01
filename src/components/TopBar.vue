<script setup lang="ts">
import {ElRow, ElCol} from "element-plus";
import FileFunction from "./FileFunction.vue";
const barList = [FileFunction]
</script>

<template>
<el-row class="el-row" align="middle">
  <el-col
      :span="2"
      class = "el-col"
      v-for="(item) in barList"
  ><component :is = item></component></el-col>
</el-row>
</template>

<style scoped>
.el-row{
  height: 100%;
}
.el-col{
  height: 100%;
  display: flex;
  justify-content: center;
}
.el-col:hover{
  background-color: var(--el-color-primary);
}
</style>