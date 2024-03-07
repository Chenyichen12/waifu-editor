<script lang="ts" setup>
import * as PIXI from "pixi.js";
import { onMounted, ref } from "vue";

const stageDomRef = ref<HTMLDivElement | null>(null)
const isSpaceDown = ref(false);
const isMouseDown = ref(false);
function shouldDragStage(e: KeyboardEvent) {
    if(e.code === "Space"){
        isSpaceDown.value = true;
        (e.target as HTMLDivElement).style.cursor = "grab"; 
    }
}
function handleKeyUp(e: KeyboardEvent) {
    isSpaceDown.value = false;
    (e.target as HTMLDivElement).style.cursor = "default"; 
}
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
    
    app.canvas.onmousedown = () => {
        isMouseDown.value = true;
    }
    app.canvas.onmouseup = () => {
        isMouseDown.value = false;
    }
    app.canvas.onmousemove = (e) => {
        if(isMouseDown.value && isSpaceDown.value){
            app.stage.position.x += e.movementX;
             app.stage.position.y += e.movementY;
        }
    }
    app.canvas.onwheel = (e) => {
        const delta = e.deltaY;
        const scale = app.stage.scale.x;
        const offset = app.stage.toGlobal(new PIXI.Point(e.offsetX,e.offsetY));
        console.log(offset);
        
        if(delta > 0){
            app.stage.scale.set(scale * 0.9);
            app.stage.position.x += offset.x*0.1 
            app.stage.position.y += offset.y*0.1
        }else{
            app.stage.scale.set(scale * 1.1);
        }
    } 
})
</script>

<template>
    <div class="container" tabindex="-1" @keydown="shouldDragStage" @keyup="handleKeyUp">
        <div class="stage" ref="stageDomRef" ></div>
    </div>
</template>

<style lang='scss' scoped>
.container{
    $padding-stage: 20px;
    padding: calc($padding-stage / 2);
    height: calc(100% - $padding-stage);
    width: calc(100% - $padding-stage);
    background-color: var(--el-menu-bg-color);
}
.stage{
    height: 100%;
    width: 100%;
}
</style>