<script setup lang="ts">
import FileFunction from "./FileFunction.vue";
const barList = [FileFunction]
</script>

<template>

<div class="top-bar">
  <component :is = item v-for="item in barList"></component>
</div>
</template>

<style scoped lang="scss">
.top-bar{
  background-color: var(--el-color-primary-light-8);
  height: 100%;
  display: flex;
}
</style>