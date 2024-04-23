<template>
  {{ error }}
  {{ manager.test }} 
  <!-- 测试 以后要删除 -->
    <VueDraggable class="drag-area" tag="ul" v-model="manager._entrys.value" group="g1" @add="onAdd(modelValue,parentName)"  >
      <!-- 导入了v-draggable -->
      <li v-for="el in modelValue" :key="el.name" class="list-item" >
          <!-- modelValue 数组中的每个元素创建一个带有特定样式和唯一键的列表项。 -->
          <!-- 按钮：用于显示和隐藏 -->
          <p class="item-name" :class="{ 'active': el.isSelect, 'inactive': !el.isSelect }" @click="selectChild(el,manager)">
            <!-- 这里有个问题，hide按钮和select功能似乎冲突了 -->
            <!-- button设置 -->
            <!-- <el-button type="primary" size="small":icon="Add" class="item-button" @click="el.addNewEntry(el)"/>
            <el-button type="primary" size="small":icon="sub" class="item-button" @click="el.deleteEntry(el)"/> -->
            <!-- 未测试以上两个按钮 -->
            <el-button type="primary" size="small":icon="ArrowRight" class="item-button" @click="toggleExpand(el)"/>
            <el-button type="primary" size="small":icon="Hide" class="item-button" @click="toggleVisibility(el)" />
            <!-- 想要实现图标在点击后改变 （未实现）-->
            
            {{ el.name }}
            <!-- {{ el.parentName=nowParent}}          -->
            {{ el.parentName }}   
            <!-- 显示每一行的name属性 -->
            <span> {{ el.isVisible ? 'Visible' : 'Hidden' }}</span>
            <!-- 判定是否改变 后面需要删掉 -->
          </p>
        <nested-directive v-model="el.children" v-show="el.listExpand" :parent-name="el.name" :manager="manager" />
        <!-- （应该是递归）显示子个体 -->
      </li>
      {{ changebefore }}
      {{ changeafter }}
      {{ manager._selectedEntry }}
      
      {{ checkSelect }}
      <!-- 从这可以发现是很多个独立的manager -->
    </VueDraggable>    
  </template>

  
  <script setup lang="ts">
  import './layer.css'
  import { VueDraggable } from 'vue-draggable-plus'
  import { vDraggable } from 'vue-draggable-plus'
  import { computed, ref,h, inject } from 'vue'
  import { ArrowRight,ArrowDown,View,Hide } from '@element-plus/icons-vue'
  import layerChangeManager from './manager.ts'
  
  // let manager = new layerChangeManager()
  let manager=inject('manager',layerChangeManager)
  // 导入manager

  let checkSelect = inject('checkSelect')
  // 导入第二种方法的检查
  
  let error=ref("")
  
  if (!manager) {
    error.value = 'No manager provided'
  }

// error为测试，之后删除

// 列表函数与属性
export  interface Entry {
    name: string
    children: Entry[]
    parentName: string  // 用于查找父图层
    isVisible: boolean //是否可见（小眼睛图标）
    listExpand:boolean //是否展开（小三角图标）
    isSelect:boolean //是否选中
    }
  // 这东西应该写在entry.ts里面

export interface Props {
    modelValue: Entry[],
    parentName: string,
    manager: layerChangeManager
  }
//进行递归调用的东西  


  const props = defineProps<Props>()
  interface Emits {
    (e: 'update:modelValue', value: Entry[]): void
  }

  const emits = defineEmits<Emits>()
  manager._entrys = computed({
    get: () => props.modelValue,
    set: value => emits('update:modelValue', value)
  })

  let changebefore:string = ""//改变前的父图层
  let changeafter:string = ""//改变后的父图层

  //在改变后记录改变前后的父图层
  function onAdd(modelValue: Entry[],parentname:string){
    for(let item of modelValue){
      if(parentname!==item.parentName){
        changebefore=item.parentName
        changeafter=parentname
        item.parentName=parentname
        // onLayerParentChange(callback:(preParent:layer, parent: layer,child: layer)=>void)
    }
    }
  }

//   let intervalId= setInterval(() =>{
//   selectIt(manager);
// },1000);

// function selectIt(manager:layerChangeManager){
    
//     function traverseTree(node: Entry) {
//     if (node.isSelect) {
//       manager._selectedEntry.push(node.name);
//       }
//     if (Array.isArray(node.children)) {
//       for (let child of node.children) {
//         traverseTree(child);
//       }
//       }
//     }
//   for (let entry of manager._entrys.value) {
//     traverseTree(entry);
//     }
//   }


  function selectChild(el:Entry,manager:layerChangeManager){
    el.isSelect=!el.isSelect  
    for(let i in el.children){ 
          let child = el.children[i]
          // 能这样写？
          selectChild(child,manager)
          // if (child.isSelect) {
          //   manager._selectedEntry.push(el.name)
          // } 
          // else {
          //   let temp=ref(0)
          //   for(let j in manager._selectedEntry){
              
          //     if(j === el.name) manager._selectedEntry.splice(temp.value,temp.value)
          //     else temp.value=temp.value+1
          //   }
            
          // }   
      }
      checkSelect=true
     }

  // 图标函数
  const toggleVisibility = (item: Entry) => {item.isVisible = !item.isVisible; }; // 切换图层可见性
  // 对于每次点击按钮修改列表相应值
  const toggleExpand = (item: Entry) => {item.listExpand = !item.listExpand;}; // 切换图层展开性  
  </script>


  <!-- 样式 -->
  <style scoped>
  
  </style>

