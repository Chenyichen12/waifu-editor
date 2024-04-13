<script setup lang="ts">
import { ElContainer, ElHeader, ElButton, ElFooter } from 'element-plus';
import { Plus, Delete } from '@element-plus/icons-vue';
import { onMounted,onUnmounted } from "vue";
import { ref, reactive,Ref } from "vue";
import type { CSSProperties } from 'vue';
import slider from "./Slider.vue"
import { Entry } from "./entry.ts";


const value=ref(0.5)
//const name=ref("左眼")
const twoFrame=ref(false)
const initValue=ref(0.5)


const list:Ref<Entry[]>=ref([
  {
    id:1,
    name:"左眼",
    value:0.3,
    isregister:false,
    type:2
    // new Entry(1,"左眼",0.3,false,2)
  },
  {
    id:2,
    name:"右眼",
    value:0.3,
    isregister:false,
    type:2
  },
  {
    id:3,
    name:"右眼 左",
    value:0.3,
    isregister:false,
    type:2
  }
])

const isMouseDown = ref(false);
//将每个滑块按钮作为数组
const sliderButtons:Ref<HTMLDivElement[]|undefined[]>=ref([])
//将每个滑块容器作为数组
const sliderContainers:Ref<HTMLDivElement[] | undefined[]>=ref([]);
// const sliderButtonRef = ref<HTMLDivElement | undefined>(undefined);
// const sliderContainerRef = ref<HTMLDivElement | undefined>(undefined);




onMounted(() => {
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", mouseUp)
    window.addEventListener("mouseLeave",mouseLeave)
    //先对滑块按钮和滑块容器进行初始化初始化
    sliderButtons.value=Array.from(document.querySelectorAll('.slibtn')).map(slider=>slider as HTMLDivElement)
    sliderContainers.value=Array.from(document.querySelectorAll('.bslider')).map(slider=>slider as HTMLDivElement)
   
});
onUnmounted(() => {
    window.removeEventListener("mousemove", handleMouseMove)
    window.removeEventListener("mouseup", mouseUp)
})



// 鼠标点击组件滑动的逻辑
function mouseDown(e: MouseEvent) {
    // alert("我被点击了")
    // value.value = 100
    isMouseDown.value = true
    const sliderIndex=sliderButtons.value.indexOf(e.target as HTMLDivElement);
    list.value[sliderIndex].value=0.5;
    console.log(sliderIndex);
    //add
    //sliderButtons.value[sliderIndex]!.style.backgroundColor='green';

}
function mouseUp(e: MouseEvent) {
    // value.value = 0
    isMouseDown.value = false;
    
    const sliderIndex=sliderButtons.value.indexOf(e.target as HTMLDivElement);
    //list.value[sliderIndex].value=0.3;


}
//新加一个鼠标移出按钮
function mouseLeave() {
    
    isMouseDown.value = false;
}



// 鼠标拖动组件滑动的逻辑
function handleMouseMove(e: MouseEvent) {
    if (isMouseDown.value) {
        //const dom = e.target as HTMLDivElement
        
        
       
        //这条语句用来检测，滑动是否被监听
        // list.value[sliderIndex].value=0.4;

        //得知动的是数组中的哪个index，向左滑的时候index为-1
        const sliderIndex=sliderButtons.value.indexOf(e.target as HTMLDivElement);
        console.log(sliderIndex);
        
 
        //由于每个框的左边位置相同，采用第0个容器就行
        const { left, right } =  sliderContainers.value[0]!.getBoundingClientRect();
        console.log(left,right);
        
        
        let x: number
        if (e.clientX < left + 10) {
     
            x = -2.5;
        } else if (e.clientX > right - 10) {
          
            x = right - left - 2.5
        } else {
            x = e.clientX - left; 
            
        }
        
        for(let i=0;i<list.value.length;i++){
            if(list.value[i].id==sliderIndex+1){
                list.value[i].value=((x+2.5)/(right-left)).toFixed(2);
                // console.log(list.value[i].value);
            }
        }
        // value.value=((x+2.5)/(right-left)).toFixed(2);
        console.log(x);
      
        //检查出行代码有错，如果向左移动，则无法移动，但x会正常改变，无法移动
        
        sliderButtons.value[sliderIndex]!.style.left = `${x}px`;
        
        
        //  sliderButtonRef.value!.style.left = `${x}px`;
    }

}



</script>

<template>

  <el-tooltip content="添加两帧" placement="top">
    <el-button type="primary" :icon="Plus" circle size="small" class="headbtn"></el-button>
  </el-tooltip>

  <el-tooltip content="添加三帧" placement="top">
    <el-button type="success" :icon='Plus' circle size="small" class="headbtn"></el-button>
  </el-tooltip>

  <el-tooltip content="取消帧" placement="top">
    <el-button type="warning" :icon="Delete" circle size="small" class="headbtn">
    </el-button>
  </el-tooltip>




  <!-- //先只添加一个下划线，后续可能会更改 -->
  <hr>
  <div><el-scrollbar height="570px" id="scrollbar">
   
    <div v-for="entry in list" class="test" >
        <div class="slider">
            <a class="nameText">
                {{entry.name}}
            </a>
            <div class="bslider" ref="sliderContainerRef${entry.id}">
                <div class="key1"></div>
                <div class="back"></div>
                <!-- slibtn为需要滑动的点 -->
                <div class="slibtn" ref="sliderButtonRef${entry.id}" v-on:mousedown="mouseDown"></div>
                <div class="key2"></div>
                <div v-if="twoFrame" class="key3"></div>
            </div>
            <a class="valueText">
               {{ entry.value}}
            </a>
        </div>
    </div>
      <!-- <slider name="左眼" :initValue="initValue"></slider>
      <slider name="右眼"></slider>
      <slider name="嘴巴"></slider>
      <slider name="鼻子左"></slider> -->
      
    </el-scrollbar></div>

  <el-button type="primary" :icon="Plus" circle size="small" class="footbtn" style="float: right;"></el-button>

  <el-button type="primary" :icon="Plus" circle size="small" class="footbtn" style="float: right;"></el-button>


  <!-- <el-input v-model="newEntryName" placeholder="请输入新条目名称" /> -->
  <!-- <el-button type="primary" icon="el-icon-plus"  circle class="btn"></el-button> -->



</template>

<style>
/* 滑动的样式，进一步需要迁移到另外的css文件 */
.slider-demo-block {
  max-width: 200px;
  display: flex;
  align-items: center;

}

.slider-demo-block {
  margin-top: 0;
  margin-left: 0;
  margin-right: 0;
  margin-bottom: 0;

}

.slider-demo-block:hover {
  background-color: #DCDCDC;
}

.slider-demo-block .demonstration {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  /* line-height: 44px; */
  flex: 1;
  /* overflow: hidden; */
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0;
  margin-top: 0;
  margin-right: 10px;
  margin-left: 7px;
}

.slider{
  margin-left: 0;
  margin-right: 0;
  margin-bottom: 0;
  margin-top: 0;
}
.sider:hover {
  background-color: #DCDCDC;

}

.slider-demo-block .demonstration+.el-slider {
  flex: 0 0 60%;
}

/* //顶部和尾部按钮的原因是靠左和靠右的间距 */
.headbtn {
  margin-right: 0px;
  margin-left: 0px;
  margin-bottom: 0px;
  margin-top: 6px;
}

.footbtn {
  margin-right: 5px;
  margin-left: 0px;
}

#scrollbar {
  /* width: 180px; */
}

.list {
  height: 400px;
}


.test {

height: 20px;
 width: 180px;
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

 color: black;
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


/* //将滑块部分看成整体，也即将帧和滑动条视为整体 */
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
.key3{
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
