<script setup lang="ts">
import {compile, computed, onMounted, onUnmounted, Ref, ref, watch} from "vue";
import Project from "../Project/Project.ts";
import Konva from "konva";
import MainStage from "./stage.ts";
import {height} from "@webtoon/psd/dist/utils";
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
  const w = computed(() => {
    return rect.value.width
  })
  const h = computed(() => {
    return rect.value.height
  })
  mainStage = new Stage(container.value, w, h, instance.root!, shouldDragStage);
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
  resizeObserver.observe(container.value!)
})
onUnmounted(() => {
  mainBox.value!.removeEventListener('keydown', stageSpaceDown);
  mainBox.value!.removeEventListener('keyup', stageKeyup);
})

</script>

<template>
  <div tabindex="-1" ref="mainBox" class="outer">
    <div ref="container" style="height: 100%;width: 100%; box-sizing: content-box">
    </div>
  </div>
</template>

<style scoped lang="scss">
.outer {
  height: 100%;
  width: 100%;
}
</style>