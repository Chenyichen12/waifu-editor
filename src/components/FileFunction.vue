<script lang="ts" setup>
import {ref} from "vue";
import parsePsd from "./ParsePsd.ts";
const showWaitDialog = ref(false);
const showErrorDialog = ref(false);
function receive(e: Event){
  console.log(e)
  let files = (e.target as HTMLInputElement).files!
  if(files.length == 0){
    return
  }
  const file = files[0];
  showWaitDialog.value = true;
  parsePsd(file).then(()=>{
    showWaitDialog.value = false
    console.log(11)
  }).catch(()=> {
    showWaitDialog.value = false
    showErrorDialog.value = true
  })
}
</script>

<template>
  <el-dropdown trigger="click" size="small" class="el-dropdown">
    <span class="title">文件</span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>
          <label for="from-psd">从PSD导入</label>
        </el-dropdown-item>
        <el-dropdown-item>打开</el-dropdown-item>
        <el-dropdown-item>保存</el-dropdown-item>
      </el-dropdown-menu>
      <input id="from-psd" type="file" style="display: none" accept=".psd,.psb" @change = "(e)=>receive(e)">
    </template>
  </el-dropdown>


  <el-dialog
      v-model="showWaitDialog"
      title="等待中"
      :show-close="false"
      :close-on-click-modal="false"
  >
  </el-dialog>
  <el-dialog
      v-model="showErrorDialog"
      title="读取失败，请检查PSD文件"
  >

  </el-dialog>
</template>

<style scoped lang="scss">
.el-dropdown {
  font-size: small;
  align-self: center;
  height: 100%;
  padding: 0 5px;
  &:hover{
    background-color: var(--el-color-primary-light-5);
  }
  &:active{
    background-color: var(--el-color-primary);
  }
  .title{
    margin: auto 0;
  }
}
label{
  font-size: small;
}

</style>