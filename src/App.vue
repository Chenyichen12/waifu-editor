
<!--
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-03-27 18:03:33
-->
<!--
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-03-27 18:03:33
-->
<script setup lang="ts">
import { ElContainer, ElHeader, ElFooter, ElMain } from "element-plus";
import TopBar from "./components/TopBar.vue";
import Stage from "./components/MainStage/Stage.vue";
import { onMounted } from "vue";
import Project from "./components/Project/Project.ts";
// 添加了关键帧组件
import FrameStage from "./components/FrameAnimatorStage/FrameStage.vue";

onMounted(async () => {
  //仅用于测试，生产模式下要删除
  const f = await fetch('/kuyaxi.psd')
  await Project.initFromPsd(await f.blob());

  //注册快捷键
  document.addEventListener("keydown",(event: KeyboardEvent)=>{
    if(event.ctrlKey && 
    event.code == "KeyZ"){
      const project = Project.instance.value;
      if(project == null){
        return;
      }
      project.unDoStack.unDo();
    }
  })
})
</script>

<template>
  <el-container class="el-container">
    <el-header class="el-header">
      <TopBar />
    </el-header>
    <el-container class="main-stage">
      <el-aside>
      </el-aside>
      <el-aside>
        <!-- 添加了关键帧组件 -->
          <FrameStage />
      </el-aside>
      <el-main>
        <Stage />
      </el-main>
    </el-container>
    <el-footer class="el-footer"></el-footer>
  </el-container>
</template>

<style scoped lang="scss">
.el-container {
  height: 100%;
  background-color: var(--el-menu-bg-color);
}

.el-header {
  height: 20px;
  background-color: var(--el-color-primary-light-8);
}

.el-footer {
  height: 20px;
  background-color: var(--el-color-primary-light-8);
}

.el-main {
  background-color: var(--el-menu-bg-color);
}

.main-stage {
  background-color: var(--el-menu-bg-color);
  border-color: var(--el-color-primary-light-8);

  .el-aside {
    background-color: var(--el-menu-bg-color);
    border-style: none solid;
    border-color: var(--el-color-primary-light-8);
    margin: 0 1px;
    width: 200px;
  }

  .el-main {
    margin: 0;
    padding: 0;
  }
}
</style>
