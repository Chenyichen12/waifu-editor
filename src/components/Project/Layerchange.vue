<template>
  <div class="flex justify-between">
    <NestedDirective v-model="list" class="w-full"></NestedDirective>
    
    <preview-list :list="list" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NestedDirective from './NestedDirective.vue'

// 导入图层时又该如何进行修改？

const list = ref([
  {
    name: '身体的曲面Z',
    isVisible: true,
    listExpand: true,
    children: [
      {
        name: '身体',
        isVisible: true,
        listExpand: true,
        children: [
          {
            name: '身体的曲面Y',
            isVisible: true,
            listExpand: true,
            children: [
              {
                name: '呼吸',
                children: [],
                isVisible: true,
                listExpand: true,
              }
            ]
          },
          {
            name: '身体的曲面X',
            children: [],
            isVisible: true,
            listExpand: true,
          }
        ]
      },
      {
        name: 'Eyebrows',
        isVisible: true,
        listExpand: true,
        children: []
      }
    ]
  },
  {
    name: '左腿位置',
    isVisible: true,
    listExpand: true,
    children: [
      {
        name: '左腿的旋转1',
        isVisible: true,
        listExpand: true,
        children: [
          {
            name: '左腿的旋转2',
            isVisible: true,
            listExpand: true,
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
    children: [
      {
        name: '右腿的旋转1',
        isVisible: true,
        listExpand: true,
        children: [
          {
            name: '右腿的旋转2',
            isVisible: true,
            listExpand: true,
            children: []
          }
        ]
      }
    ]
  }
])
</script>
