<script setup lang="ts">
import { Plus, Delete } from '@element-plus/icons-vue';
import { shallowRef, watch } from "vue";
import { ref, Ref } from "vue";
import Entry from "./entry.ts";
import Project from '../Project/Project';
import EntryManager from './EntryManager';
import slider from "./Slider.vue"
import { instanceApp } from '../../MainStage/StageApp';
import { aroundKey } from './AnimateEntry';
import KeyFrameData from './KeyFrame';
const AnimateManager = shallowRef<EntryManager | undefined>(undefined)
const list: Ref<Entry[]> = ref([]);

watch(Project.instance, (value) => {
  if (value != null) {
    list.value = [];
    AnimateManager.value = value.entryManager
    AnimateManager.value.entrys.forEach((value,i) => {
      const newEntry: Entry = {
        id: value.id,
        name: value.name,
        howManyKey: value.howManyPoint(),
        value: value.currentValue,
        isregister: false,
        aroundType: value.around,
        isSelect: false,
        onSelect: () => {
          const entry = AnimateManager.value!.getEntryById(value.id);
          AnimateManager.value!.selectEntry = entry;
          list.value.forEach((v) => {
            if (v.id != value.id) {
              v.isSelect = false;
            }
          })
        },
        onValueChange: (n) => {
          const num = AnimateManager.value!.entrys.map((v) => {
            if (v.id == value.id) {
              return n;
            } else {
              return v.currentValue;
            }
          });
          AnimateManager.value!.setKeyValue(num);
        }
      };
      value.onValueChange = ()=>{
        list.value[i].value = value.currentValue;
      }
      list.value.push(newEntry)
    })
  }
})

function handleClearSelect() {
  if (AnimateManager.value != undefined) {
    AnimateManager.value.selectEntry = undefined;
  }
  list.value.forEach((v) => {
    v.isSelect = false;
  })
}
function addTwoKeyData() {
  const selectEntry = AnimateManager.value?.selectEntry;
  if (selectEntry == undefined) {
    return;
  }
  const selectLayer = instanceApp.value?.getLayerIsSelected();
  if (selectLayer == undefined || selectLayer.length == 0) {
    return;
  }

  for (const layer of selectLayer) {
    const datas = EntryManager.getCurrentLayerData(layer)
    const minNum = selectEntry.around == aroundKey.zero2one ? 0 : -1
    const key1 = new KeyFrameData(minNum, datas.uvs, datas.rotation);
    const key2 = new KeyFrameData(1, datas.uvs, datas.rotation);
    selectEntry.addKeyData(datas.id, [key1, key2]);
  }

  const v = list.value.find((v) => {
    return v.id == selectEntry.id;
  });
  if (v != undefined) v.howManyKey = 2;
}



</script>

<template>

  <el-tooltip content="添加两帧" placement="top">
    <el-button type="primary" :icon="Plus" circle size="small" class="headbtn"
      v-bind:onclick="addTwoKeyData"></el-button>
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
  <div @click="handleClearSelect"><el-scrollbar height="570px" id="scrollbar">

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
