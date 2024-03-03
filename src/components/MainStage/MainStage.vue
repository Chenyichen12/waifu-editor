<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from "vue";
import Project from "../Project/Project.ts";
import MainStage from "./stage.ts";

let mainStage: MainStage | null = null //Konva舞台
const container = ref<HTMLDivElement | null>(null)//内层canvas
const mainBox = ref<HTMLDivElement | null>(null)//外层main

const shouldDragStage = ref(false);//是否拖动stage
const rect = ref({width: 0, height: 0}); // canvas矩形大小 应当与容器大小保持一致

/**
 * 观察container的变化以更改canvas大小
 */
const resizeObserver = new ResizeObserver((e) => {
  rect.value.width = e[0].contentRect.width
  rect.value.height = e[0].contentRect.height
})
const project = Project.instance; // project快照
/**
 * 观察project的情况，MainStage的入口
 */
watch(project, (instance) => {
  if (instance == null) {
    if (mainStage != null) {
      mainStage.destroy(); // 当mainStage不为空的时候说明更换了project要destroy
    }
    return
  }
  if (container.value == null) {
    console.log("error")
    return;
  }
  mainStage = new MainStage(container.value, rect, instance.root!, shouldDragStage);
})

/**
 * 当空格被按下的时候应当让舞台可以被拖动
 */
function stageSpaceDown(e: KeyboardEvent) {
  if (e.code == "Space") {
    mainBox.value!.style.cursor = "pointer"
    shouldDragStage.value = true
  }
}

/**
 * 当没有键盘事件的时候应当回到原来的状态
 */
function stageKeyup() {
  mainBox.value!.style.cursor = "default"
  shouldDragStage.value = false
}

onMounted(() => {
  mainBox.value!.addEventListener('keydown', stageSpaceDown);
  mainBox.value!.addEventListener('keyup', stageKeyup);
  resizeObserver.observe(mainBox.value!)
})
onUnmounted(() => {
  mainBox.value!.removeEventListener('keydown', stageSpaceDown);
  mainBox.value!.removeEventListener('keyup', stageKeyup);
  resizeObserver.disconnect();
})

</script>

<template>
  <div tabindex="-1" ref="mainBox" class="outer"
       @focus="(e)=>{(e.target as HTMLDivElement).style.borderColor = 'var(--el-color-primary)'}"
       @blur="(e)=>{(e.target as HTMLDivElement).style.borderColor = 'var(--el-menu-bg-color)'}">
    <div ref="container" style="height: 100%;">
    </div>
  </div>
</template>

<style scoped lang="scss">
.outer {
  height: calc(100% - 22px);
  padding: 10px;
  align-self: center;
  outline-style: none;
  border-style: solid;
  border-color: var(--el-menu-bg-color);
  border-width: 1px;
}
</style>