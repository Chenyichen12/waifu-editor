<script lang="ts" setup>
import * as PIXI from "pixi.js";
import {onMounted, ref} from "vue";

const stageDomRef = ref<HTMLDivElement | null>(null)
const isSpaceDown = ref(false);
const isMouseDown = ref(false);

function shouldDragStage(e: KeyboardEvent) {
  if (e.code === "Space") {
    isSpaceDown.value = true;
    (e.target as HTMLDivElement).style.cursor = "grab";
  }
}

function handleKeyUp(e: KeyboardEvent) {
  isSpaceDown.value = false;
  (e.target as HTMLDivElement).style.cursor = "default";
}

onMounted(async () => {

  if (stageDomRef.value == null) {
    return;
  }
  const app = new PIXI.Application()
  await app.init({
    background: "#4BC1F0",
    resizeTo: stageDomRef.value
  })
  stageDomRef.value.appendChild(app.canvas);
  //TODO: 模拟一个背景，之后要对接到psd解析模块
  const bg = new PIXI.Graphics();
  const scalex = app.screen.width / 3000;
  const scaley = app.screen.height / 5000;
  const scale = scalex > scaley ? scaley : scalex;
  bg.rect(0, 0, 3000, 5000);
  const scaleAfterX = 3000*scale
  const scaleAfterY = 5000*scale
  app.stage.scale.set(scale)
  app.stage.position.set(app.screen.width/2-scaleAfterX/2,app.screen.height/2-scaleAfterY/2)
  bg.fill(0xECECEC)

  app.stage.addChild(bg);

  app.canvas.onmousedown = () => {
    isMouseDown.value = true;
  }
  app.canvas.onmouseup = () => {
    isMouseDown.value = false;
  }
  app.canvas.onmousemove = (e) => {
    if (isMouseDown.value && isSpaceDown.value) {
      app.stage.position.x += e.movementX;
      app.stage.position.y += e.movementY;
    }
  }
  app.canvas.onwheel = (e) => {
    const stagePos = app.stage.toLocal({x: e.offsetX,y:e.offsetY});
    const oldZoom = app.stage.scale.x
    const scale = e.deltaY>0?oldZoom*0.9:oldZoom*1.1;
    const oldDx = stagePos.x*oldZoom - stagePos.x*scale;
    const oldDy =  stagePos.y*oldZoom - stagePos.y*scale;
    app.stage.scale.set(scale);
    app.stage.position.x += oldDx;
    app.stage.position.y += oldDy
  }
})
</script>

<template>
  <div class="container" tabindex="-1" @keydown="shouldDragStage" @keyup="handleKeyUp">
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
}

.stage {
  height: 100%;
  width: 100%;
}
</style>