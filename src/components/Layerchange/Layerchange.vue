<template>
  <div class="flex justify-between">
    <NestedDirective v-model="manager._entrys.value" class="w-full"></NestedDirective>
    
    
    <preview-list :list="manager._entrys.value" />
    
      <!-- {{ intervalId }} -->
  <p>{{ manager._selectedEntry }}</p>
  <!-- 按理说能够显示正确的选择条目 -->
  <p>{{ checkSelect }}</p>
  <!-- 第二种方法的检查，当调用select函数时值应当改变 -->
  </div>
</template>

<script setup lang="ts">
import { inject, ref,provide, watch } from 'vue'
import NestedDirective from './NestedDirective.vue'
import layerChangeManager from './manager.ts'
import { Entry } from './NestedDirective.vue';
import { selectionModeWithDefault } from 'element-plus/es/components/date-picker/src/props/shared.mjs';

// 导入图层时又该如何进行修改？
//导入图层时，遍历一次把所有parentname改对
let manager=new layerChangeManager()
provide ('manager',manager)
// 为了能够在其他组件中使用manager，我将其提供出去

let checkSelect: boolean = false
provide ('checkSelect',checkSelect)
// 第二种方法的检查，当调用select函数时值应当改变

watch(() => checkSelect,() =>{
  selectIt(manager);
});
// 第二种方法

// let intervalId= setInterval(() =>{
//   selectIt(manager);
// },1000);
// 我甚至让它尝试不停的运行

function selectIt(manager:layerChangeManager){
    
    function traverseTree(node: Entry) {
    if (node.isSelect) {
      manager._selectedEntry.push(node.name);
      }
    if (Array.isArray(node.children)) {
      for (let child of node.children) {
        traverseTree(child);
      }
      }
    }
  for (let entry of manager._entrys.value) {
    traverseTree(entry);
    }
  }
  // 遍历节点并加入selectentry

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
