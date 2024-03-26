<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import Project from "../Project/Project.ts";
import StageApp from './StageApp'
const stageDomRef = ref<HTMLDivElement | null>(null)

function shouldDragStage(e: KeyboardEvent) {
  if (e.code === "Space") {
    StageApp.isSpacePress = true;
    (e.target as HTMLDivElement).style.cursor = "pointer";
  }
}

function handleKeyUp(e: KeyboardEvent) {
  StageApp.isSpacePress = false;
  (e.target as HTMLDivElement).style.cursor = "default";
}
watch(Project.instance, (v) => {
  if (v == null) return;
  initApp();
})
function initApp() {
  StageApp.create(stageDomRef.value!);

}
onMounted(async () => {
})
</script>

<template>
  <div class="container" tabindex="1" @keydown="shouldDragStage" @keyup="handleKeyUp">
    <div class="stage" ref="stageDomRef"></div>
  </div>
</template>

<style lang='scss' scoped>
.container {
  $padding-stage: 20px;
  padding: calc($padding-stage / 2);
  height: calc(100% - $padding-stage);
  width: calc(100% - $padding-stage);
  background-color: var(--el-menu-bg-color);
  outline-color: var(--el-color-primary);
}

.stage {
  height: 100%;
  width: 100%;
}
</style>