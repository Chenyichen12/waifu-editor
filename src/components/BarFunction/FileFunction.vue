<!--
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-03-27 18:03:33
-->
<script lang="ts" setup>
import { ref } from "vue";
import Project from "../Project/Project"
const showWaitDialog = ref(false);
const showErrorDialog = ref(false);

function receive(e: Event) {
  let files = (e.target as HTMLInputElement).files!
  if (files.length == 0) {

    return
  }
  const file = files[0];
  showWaitDialog.value = true;
  Project.initFromPsd(file).then(() => {
    showWaitDialog.value = false
  }).catch(() => {
    showWaitDialog.value = false
    showErrorDialog.value = true
  })
}
</script>

<template>
  <el-dropdown trigger="click" size="small">
    <span>文件</span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>
          <label for="from-psd">从PSD导入</label>
        </el-dropdown-item>
        <el-dropdown-item>打开</el-dropdown-item>
        <el-dropdown-item>保存</el-dropdown-item>
      </el-dropdown-menu>
      <input id="from-psd" type="file" style="display: none" accept=".psd,.psb" @change="(e) => receive(e)">
    </template>
  </el-dropdown>


  <el-dialog v-model="showWaitDialog" title="等待中" :show-close="false" :close-on-click-modal="false">
  </el-dialog>
  <el-dialog v-model="showErrorDialog" title="读取失败，请检查PSD文件">

  </el-dialog>
</template>

<style scoped lang="scss">
@import "BarStyle";
</style>
