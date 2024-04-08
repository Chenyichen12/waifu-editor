

<script setup lang="ts">
import { ElContainer, ElHeader, ElMain, ElScrollbar, ElButton, ElFooter } from 'element-plus';
import { onMounted } from "vue";


onMounted(() => {
    
})

</script>

<template>
<el-container>
    <el-header>
      <el-button type="primary" icon="el-icon-plus" size="small">添加关键帧</el-button>
      <el-button icon="el-icon-delete" size="small">移除关键帧</el-button>
    </el-header>
    <el-main>
      <el-scrollbar>
        <ul>
          <!-- <li v-for="entry in entryList" :key="entry.name">
            <span>{{ entry.name }}</span>
            <div class="keyframes">
              <span v-for="(value, index) in entry.keyframes" :key="index">
                {{ value }}
              </span>
            </div>
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
          </li> -->
        </ul>
      </el-scrollbar>
    </el-main>
    <el-footer>
      <!-- <el-input v-model="newEntryName" placeholder="请输入新条目名称" /> -->
      <el-button type="primary" icon="el-icon-plus">添加条目</el-button>
    </el-footer>
  </el-container>


</template>

<style>



</style>