<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';

const value = ref(0.5)

const isMouseDown = ref(false);

const sliderButtonRef = ref<HTMLDivElement | undefined>(undefined);
const sliderContainerRef = ref<HTMLDivElement | undefined>(undefined);
onMounted(() => {
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", mouseUp)
})
function mouseDown() {
    // alert("我被点击了")
    // value.value = 100
    isMouseDown.value = true
}
function mouseUp() {
    // value.value = 0
    isMouseDown.value = false;
}

// 鼠标拖动组件滑动的逻辑
function handleMouseMove(e: MouseEvent) {
    if (isMouseDown.value) {
        //const dom = e.target as HTMLDivElement
        const { left, right } = sliderContainerRef.value!.getBoundingClientRect();

        let x: number
        if (e.clientX < left + 10) {
            x = -2.5;
        } else if (e.clientX > right - 10) {
            x = right - left - 2.5
        } else {
            x = e.clientX - left;
        }
        value.value=((x+2.5)/(right-left)).toFixed(2);
        sliderButtonRef.value!.style.left = `${x}px`;
    }

}


</script>

<template>
    <div class="test">
        <div class="slider">
            <a class="nameText">
                左眼
            </a>
            <div class="bslider" ref="sliderContainerRef">
                <div class="key1"></div>
                <div class="back"></div>
                <!-- slibtn为需要滑动的点 -->
                <div class="slibtn" ref="sliderButtonRef" v-on:mousedown="mouseDown"></div>
                <div class="key2"></div>
            </div>
            <a class="valueText">
               {{ value}}
            </a>
        </div>
    </div>
</template>

<style lang="scss">
.test {

    height: 20px;
    // width: 180px;
    padding: 2px;
    background-color: white;
    margin-left: 0;
    margin-top: 0;
    margin-bottom: 0;
    margin-right: 0;

    :hover {
        background-color: rgb(235, 235, 235);
    }

}

.slider {
    gap: 15px;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    flex: 1;

    // color: black;
    .nameText {
        width: 20%;
        height: 100%;
        font-size: 14px;
        white-space: nowrap;
        margin-left: 0;
        margin-right: 0;

    }

    .bslider {
        width: 65%;

        //以下为自己手搓的滑动按钮


    }

    .valueText {
        width: 10%;
        height: 100%;
        top:calc(50%);
        white-space: nowrap;
        text-align: left;
        margin-left: 0;
        margin-right: 0;
        font-size: 9px;
    }

}


//将滑块部分看成整体，也即将帧和滑动条视为整体
.bslider {
    flex: 1;
    height: 100%;
    width: 100px;
    display: flex;
    position: relative;
    margin-left: 0;
    margin-right: 0;

    .back {
        position: absolute;
        z-index: 1;
        top: calc(50% - 1px);


        height: 2px;
        width: 100%;

        background-color: black;
    }

    .key1 {
        position: absolute;
        top: calc(50% - 5px);
        left: calc(-2.5px);
        height: 10px;
        width: 10px;
        border-radius: 5px;
        z-index: 2;
        background-color: green;
    }

    .slibtn {
        position: absolute;
        top: calc(50% - 5px);
        left: calc(50% - 2.5px);

        z-index: 3;

        width: 10px;
        /* 按钮的宽度 */
        height: 10px;
        /* 按钮的高度 */
        line-height: 5px;
        /* 行高与按钮高度相同，用于垂直居中文本 */
        border-radius: 5px;
        /* 边框半径为50%，创建一个圆形 */

        background-color: red;
        /* 背景颜色 */
        color: #000;
        /* 文本颜色 */
        text-align: center;
        /* 文本居中 */
        cursor: pointer;
        /* 鼠标悬停时显示手形光标 */
        /* 可以添加其他样式，如阴影、过渡效果等 */
    }

    .key2 {
        position: absolute;
        top: calc(50% - 5px);
        left: calc(100% - 2.5px);
        height: 10px;
        width: 10px;
        z-index: 2;
        border-radius: 5px;
        background-color: green;

    }

}
</style>