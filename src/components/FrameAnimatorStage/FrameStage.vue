<script setup lang="ts">
import { Plus, Delete } from '@element-plus/icons-vue';
import { shallowRef, watch } from "vue";
import { ref, Ref } from "vue";
import Entry from "./entry.ts";
import Project from '../Project/Project';
import EntryManager from './EntryManager';
import slider from "./Slider.vue"
const AnimateManager = shallowRef<EntryManager | undefined>(undefined)
const list: Ref<Entry[]> = ref([]);

watch(Project.instance, (value) => {
  if (value != null) {
    list.value = [];
    AnimateManager.value = value.entryManager
    AnimateManager.value.entrys.forEach((value, key) => {
      const newEntry: Entry = {
        id: key,
        name: value.name,
        howManyKey: value.howManyPoint(),
        value: value.currentValue,
        isregister: false,
        aroundType: value.around,
        onValueChange: (n, o) => {
          value.currentValue = n;
        }
      };
      list.value.push(newEntry)
    })
  }
})


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

      <div v-for="(_entry, index) in list">
        <slider v-model="list[index]" />
      </div>


    </el-scrollbar></div>

  <el-button type="primary" :icon="Plus" circle size="small" class="footbtn" style="float: right;"></el-button>

  <el-button type="primary" :icon="Plus" circle size="small" class="footbtn" style="float: right;"></el-button>


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
</style>
