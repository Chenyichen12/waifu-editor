<!--
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-05-06 09:30:32
-->
<template>
  <VueDraggable class="drag-area" tag="div" v-model="showList" group="g1">
    <div v-for="el in modelValue" :key="el.id" class="list-item">
      <div class="one-entry" @click="(e) => handleSelectedClick(e, el.id)"
        :style="{ backgroundColor: el.isSelect ? 'var(--el-color-primary-light-5)' : '' }">
        <div class="image-container">
          <img :width="40" :height="40" v-if="el.imageUrl != undefined" :src="el.imageUrl">
          <img v-else src="/src/assets/IntreeFileOpen.svg" :width="40" :height="40">
        </div>

        <div class="item-name">
          {{ el.name }}
          <span> {{ el.isVisible ? 'Visible' : 'Hidden' }}</span>
        </div>
        <el-button v-show="el.type == 'refator'" type="primary" size="small" class="item-button"
          @click="toggleExpand(el)">
          展开
        </el-button>
        <el-button type="primary" size="small" class="item-button" @click="toggleVisibility(el)">
          隐藏
        </el-button>

      </div>
      <nested-directive v-model="el.children" v-show="el.listExpand" :parent-name="el.name" />
    </div>
  </VueDraggable>
</template>


<script setup lang="ts">
import { Ref, computed, inject } from 'vue';
import { Entry } from './Entry';
import { VueDraggable } from 'vue-draggable-plus';
import EntryManager from './EntryManager';
import Project from '../Project/Project';
interface Props {
  modelValue: Entry[],
}
//进行递归调用的东西  
const props = defineProps<Props>()
interface Emits {
  (e: 'update:modelValue', value: Entry[]): void
}

const layers = inject<Ref<EntryManager>>("layerManager")

const emits = defineEmits<Emits>()
const showList = computed<Entry[]>({
  get: () => props.modelValue,
  set: value => emits('update:modelValue', value)
})

function handleSelectedClick(e: MouseEvent, id: string) {
  const project = Project.instance.value;
  if (project == undefined) {
    return;
  }
  if (!e.shiftKey) {
    removeSelect(layers!.value.children);
    project.currentSelectedLayer = [];
  }
  const item = props.modelValue.find((v) => v.id == id);
  if (item != undefined) {
    item.isSelect = !item.isSelect;
    if (item.isSelect) {
      project.currentSelectedLayer = [...project.currentSelectedLayer, item.id];
    } else {
      project.currentSelectedLayer = project.currentSelectedLayer.filter((v) => v !== item.id);
    }
  }

  function removeSelect(child: Entry[]) {
    for (const c of child) {
      c.isSelect = false;
      if (c.children.length != 0) {
        removeSelect(c.children);
      }
    }
  }
}

// 图标函数
const toggleVisibility = (item: Entry) => { item.isVisible = !item.isVisible; }; // 切换图层可见性
// 对于每次点击按钮修改列表相应值
const toggleExpand = (item: Entry) => { item.listExpand = !item.listExpand; }; // 切换图层展开性  
</script>


<style scoped>
.one-entry {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}

.one-entry .image-container {
  width: 30px;
  height: 30px;
}

.one-entry .image-container img {
  object-fit: contain;
}
</style>
