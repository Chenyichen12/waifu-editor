<template>
    <ul v-draggable="[list, { group: 'g1' }]" class="drag-area">
      <!-- 导入了v-draggable -->
      <li v-for="el in modelValue" :key="el.name" class="list-item">
          <!-- modelValue 数组中的每个元素创建一个带有特定样式和唯一键的列表项。 -->
          <!-- 按钮：用于显示和隐藏 -->
          <p class="item-name">
            <!-- button设置 -->
            <el-button type="primary" size="small":icon="ArrowRight" class="item-button" @click="toggleExpand(el)"/>
            <el-button type="primary" size="small":icon="Hide" class="item-button" @click="toggleVisibility(el)" />
            <!-- 想要实现图标在点击后改变 （未实现）-->
            {{ el.name }}
            <!-- 显示每一行的name属性 -->
            <span> {{ el.isVisible ? 'Visible' : 'Hidden' }}</span>
            <!-- 判定是否改变 后面需要删掉 -->
          </p>
        <nested-directive v-model="el.children" v-show="el.listExpand" />
        <!-- （应该是递归）显示子个体 -->
      </li>
    </ul>
  </template>
  <script setup lang="ts">
  import './layer.css'
  import { vDraggable } from 'vue-draggable-plus'
  import { computed, ref,h ,Ref} from 'vue'
  import { ArrowRight,ArrowDown,View,Hide } from '@element-plus/icons-vue'
  // import botton from './botton.vue'
  // import { NormalLayer } from './LayerStruct';
  


// 列表函数与属性
  interface IList {
    name: string
    children: IList[]
    layerid: string  // 用于查找图层
    isVisible: boolean //是否可见（小眼睛图标）
    listExpand:boolean //是否展开（小三角图标）
  }
  
  interface Props {
    modelValue: IList[]
  }
  
  const props = defineProps<Props>()
  interface Emits {
    (e: 'update:modelValue', value: IList[]): void
  }
  const emits = defineEmits<Emits>()
  const list = computed({
    get: () => props.modelValue,
    set: value => emits('update:modelValue', value)
  })

  // 图标函数
  const toggleVisibility = (item: IList) => {item.isVisible = !item.isVisible; }; // 切换图层可见性
  // 对于每次点击按钮修改列表相应值
  const toggleExpand = (item: IList) => {item.listExpand = !item.listExpand;}; // 切换图层展开性
  
  
  // type onLayerParentChange(callback:(preParent:NormalLayer, parent: NormalLayer,child: NormalLayer)=>void)
  //  还不太明白我要干什么
  </script>


  <!-- 样式 -->
  <style scoped>
  
  </style>

