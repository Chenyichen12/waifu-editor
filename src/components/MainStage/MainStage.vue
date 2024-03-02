<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from "vue";
import Project from "../Project/Project.ts";
import Konva from "konva";
import Stage from "./stage.ts";

let mainStage: Konva.Stage | null = null
const container = ref<HTMLDivElement | null>(null)//内层canvas
const mainBox = ref<HTMLDivElement | null>(null)//外层main

const shouldDragStage = ref(false);//是否拖动stage
const rect = ref({width: 0, height: 0});
const resizeObserver = new ResizeObserver((e) => {
  rect.value.width = e[0].contentRect.width
  rect.value.height = e[0].contentRect.height
})
const project = Project.instance;
/**
 * 观察project的情况，项目的入口
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
  mainStage = new Stage(container.value, rect, instance.root!, shouldDragStage);
})


function stageSpaceDown(e: KeyboardEvent) {
  if (e.code == "Space") {
    mainBox.value!.style.cursor = "pointer"
    shouldDragStage.value = true
  }
}

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