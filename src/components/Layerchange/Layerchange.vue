<template>
  <div class="flex justify-between">
    <NestedDirective v-model="manager._entrys.value" class="w-full" parent-name="root"></NestedDirective>
    <preview-list :list="manager._entrys.value" />
  <p>{{ manager._selectedEntry }}</p>
  </div>
  <div>
    {{ manager._entrys.value }}
    {{ manager.deletesselect }}
    {{ manager.changebefore }}
    {{ manager.changeafter }}
    <!-- 用于验证的要素 -->
  </div>
</template>

<script setup lang="ts">
import { inject, ref,provide, watch, reactive } from 'vue'
import NestedDirective from './NestedDirective.vue'
import manager from './manager.ts'
import { Entry } from './Entry.ts';

let showList= reactive(manager._entrys)

watch(showList,(newVal,oldVal) =>{
  manager._entrys.value=newVal;
  manager.test.value="yes!!!!"
},{deep:true}),
// 示例数据
manager._entrys = ref([
  {
    name: '身体的曲面Z',
    isVisible: true,
    listExpand: true,
    parentName: "Root",
    isSelect: false,
    children: [
      {
        name: '身体',
        isVisible: true,
        listExpand: true,
        isSelect: false,
        parentName: "身体的曲面Z",
        children: [
          {
            name: '身体的曲面Y',
            isVisible: true,
            listExpand: true,
            parentName: "身体",
            isSelect: false,
            children: [
              {
                name: '呼吸',
                children: [],
                isVisible: true,
                listExpand: true,
                isSelect: false,
                parentName: "身体的曲面Y"
              }
            ]
          },
          {
            name: '身体的曲面X',
            children: [],
            isVisible: true,
            listExpand: true,
            isSelect: false,
            parentName: "身体"
          }
        ]
      },
      {
        name: 'Eyebrows',
        isVisible: true,
        listExpand: true,
        parentName: "身体的曲面Z",
        isSelect: false,
        children: []
      }
    ]
  },
  {
    name: '左腿位置',
    isVisible: true,
    listExpand: true,
    parentName: "Root",
    isSelect: false,
    children: [
      {
        name: '左腿的旋转1',
        isVisible: true,
        listExpand: true,
        parentName: "左腿位置",
        isSelect: false,
        children: [
          {
            name: '左腿的旋转2',
            isVisible: true,
            listExpand: true,
            parentName: "左腿的旋转1",
            isSelect: false,
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
    isSelect: false,
    children: [
      {
        name: '右腿的旋转1',
        isVisible: true,
        listExpand: true,
        isSelect: false,
        parentName: "右腿的位置",
        children: [
          {
            name: '右腿的旋转2',
            isVisible: true,
            listExpand: true,
            isSelect: false,
            parentName: "右腿的旋转1",
            children: []
          }
        ]
      }
    ]
  }
])
</script>
