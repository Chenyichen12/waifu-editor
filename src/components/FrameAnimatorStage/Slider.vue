<script setup lang="ts">
import { Ref, onMounted, onUnmounted, ref } from 'vue';
import Entry from './entry';
import { aroundKey } from './AnimateEntry';

const model = defineModel<Entry>({ required: true })
const container: Ref<HTMLDivElement | undefined> = ref(undefined);
const sliButton: Ref<HTMLDivElement | undefined> = ref(undefined);

const isMousePress = ref(false)

function handleMouseDown(_e: MouseEvent) {
    isMousePress.value = true;
}
function handleMouseMove(e: MouseEvent) {
    if (isMousePress.value) {
        const { left, right, width } = container.value!.getBoundingClientRect();
        let x: number
        let modelVal: number
        const modelMin = model.value.aroundType == aroundKey.one2one ? -1 : 0
        if (e.clientX < left + 5) {
            x = -2.5;
            modelVal = modelMin
        } else if (e.clientX > right - 5) {
            x = right - left - 2.5
            modelVal = 1;
        } else {
            x = e.clientX - left;
            modelVal = (e.clientX - left) / width * (1 - modelMin) + modelMin
        }

        sliButton.value!.style.left = `${x}px`;

        const oldVal = model.value.value;

        if (oldVal != modelVal) {
            model.value.value = modelVal;
            model.value.onValueChange(modelVal, oldVal);
        }
    }
}
function handleMouseUp(_e: MouseEvent) {
    isMousePress.value = false;
}
onMounted(() => {
    let style = "calc(50%-2.5px)"
    switch (model.value.aroundType) {
        case aroundKey.one2one: {
            const { width } = container.value!.getBoundingClientRect();
            const left = (model.value.value + 1) / 2 * width
            style = `${left}px`;
            break;
        }

        case aroundKey.zero2one: {
            const { width } = container.value!.getBoundingClientRect();
            const left = model.value.value * width
            style = `${left}px`
        }
    }
    sliButton.value!.style.left = style;


    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
})

onUnmounted(() => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp)
})
function handleSelectClick(e: MouseEvent) {
    model.value.isSelect = true;
    model.value.onSelect();
    e.stopPropagation();
}


</script>

<template>
    <div class="outerSlider"
        :style="model.isSelect ? { backgroundColor: 'rgb(235, 235, 235)' } : { backgroundColor: 'white' }"
        @click="handleSelectClick">
        <div class="slider">
            <a class="nameText">
                {{ model.name }}
            </a>
            <div class="bslider" ref="container">
                <div v-show="model.howManyKey == 2">
                    <div class="key1"></div>
                    <div class="key2"></div>
                </div>
                <div v-show="model.howManyKey == 3">
                    <div class="key1"></div>
                    <div class="key2"></div>
                    <div class="key3"></div>
                </div>

                <div class="back"></div>
                <!-- slibtn为需要滑动的点 -->
                <div class="slibtn" ref="sliButton" v-on:mousedown="handleMouseDown"></div>

            </div>
            <a class="valueText">
                {{ model.value.toFixed(2) }}
            </a>
        </div>
    </div>
</template>

<style lang="scss">
.outerSlider {

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

    .valueText {
        width: 10%;
        height: 100%;
        top: calc(50%);
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

    .key3 {
        position: absolute;
        top: calc(50% - 5px);
        left: calc(50% - 2.5px);
        height: 10px;
        width: 10px;
        z-index: 2;
        border-radius: 5px;
        background-color: green;

    }
}
</style>