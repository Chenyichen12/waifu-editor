<script setup lang="ts">
import { ElContainer, ElHeader, ElButton, ElFooter } from 'element-plus';
import { Plus, Delete } from '@element-plus/icons-vue';
import { onMounted } from "vue";
import { ref, reactive } from "vue";
import type { CSSProperties } from 'vue';
import slider from "./Slider.vue"




onMounted(() => {

})

const formatTooltip = (val: number) => {
  return val / 100
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
      <!-- <div class="slider-demo-block">
        测试组件效果先把名字写死，后续再改

        <span class="demonstration">眉毛1</span>
        <el-slider v-model="value"  :format-tooltip="formatTooltip" size="small" />
        <span class="demonstration">{{ value }}</span>
      </div>
      <div class="slider-demo-block">
        测试组件效果先把名字写死，后续再改

        <span class="demonstration">眉毛1</span>
        <el-slider v-model="value1" :format-tooltip="formatTooltip" size="small" />
        <span class="demonstration">{{ value1 }}</span>

      </div>

      <div class="slider-demo-block">
        测试组件效果先把名字写死，后续再改

        <span class="demonstration">眉毛1</span>
        <el-slider v-model="value2" :format-tooltip="formatTooltip" size="small" />
        <span class="demonstration">{{ value2 }}</span>
      </div> -->

      <slider></slider>
      <slider></slider>
      <slider></slider>
      <slider></slider>
      <!-- <button circle></button> -->
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
</style>
