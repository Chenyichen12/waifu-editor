<script lang="ts" setup>
import * as PIXI from "pixi.js";
import { onMounted, ref } from "vue";

const stageDomRef = ref<HTMLDivElement | null>(null)

onMounted(async ()=>{
    if(stageDomRef.value == null){
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
    const scalex = app.screen.width/3000;
    const scaley = app.screen.height/5000;
    const scale = scalex > scaley ? scaley : scalex;
    bg.rect(0,0,3000,5000);
    bg.position.set(app.screen.width/2,app.screen.height/2);
    bg.pivot.set(1500,2500);
    bg.scale.set(scale);
    bg.fill(0xECECEC)

    app.stage.addChild(bg);
})
</script>

<template>
    <div class="stage" ref="stageDomRef">
        
    </div>
</template>

<style lang='scss'>
.stage{
    $padding-stage: 20px;
    padding: calc($padding-stage / 2);
    height: calc(100% - $padding-stage);
    width: calc(100% - $padding-stage);
    background-color: var(--el-menu-bg-color);
}
</style>