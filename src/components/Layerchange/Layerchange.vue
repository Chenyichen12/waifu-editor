<template>
  <div class="flex justify-between">
    <NestedDirective v-model="list" class="w-full"></NestedDirective>
    
    <preview-list :list="list" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NestedDirective from './NestedDirective.vue'
import { Root } from './LayerStruct';

// 导入图层时又该如何进行修改？
//导入图层时，遍历一次把所有parentname改对
const list = ref([
  {
    name: '身体的曲面Z',
    isVisible: true,
    listExpand: true,
    parentName: "Root",
    children: [
      {
        name: '身体',
        isVisible: true,
        listExpand: true,
        parentName: "身体的曲面Z",
        children: [
          {
            name: '身体的曲面Y',
            isVisible: true,
            listExpand: true,
            parentName: "身体",
            children: [
              {
                name: '呼吸',
                children: [],
                isVisible: true,
                listExpand: true,
                parentName: "身体的曲面Y"
              }
            ]
          },
          {
            name: '身体的曲面X',
            children: [],
            isVisible: true,
            listExpand: true,
            parentName: "身体"
          }
        ]
      },
      {
        name: 'Eyebrows',
        isVisible: true,
        listExpand: true,
        parentName: "身体的曲面Z",
        children: []
      }
    ]
  },
  {
    name: '左腿位置',
    isVisible: true,
    listExpand: true,
    parentName: "Root",
    children: [
      {
        name: '左腿的旋转1',
        isVisible: true,
        listExpand: true,
        parentName: "左腿位置",
        children: [
          {
            name: '左腿的旋转2',
            isVisible: true,
            listExpand: true,
            parentName: "左腿的旋转1",
            children: []
          }
        ]
      }
    ]
  },
  {
    name: '右腿的位置',
    isVisible: true,
    listExpand: true,
    parentName: "Root",
    children: [
      {
        name: '右腿的旋转1',
        isVisible: true,
        listExpand: true,
        parentName: "右腿的位置",
        children: [
          {
            name: '右腿的旋转2',
            isVisible: true,
            listExpand: true,
            parentName: "右腿的旋转1",
            children: []
          }
        ]
      }
    ]
  }
])
</script>
