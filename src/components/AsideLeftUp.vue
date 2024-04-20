<!--
    图像管理部分的vue文件
-->


<script setup lang="ts">
import { computed,  ref,Ref,reactive, shallowRef, watch ,Component,CSSProperties} from "vue";
import FileFunction from "./BarFunction/FileFunction.vue";
const GraphCommandList = [FileFunction]
import { ElTree } from 'element-plus'


const isAddIconVisible = ref(true);//可视图标的点击改变图标
    // 切换图标和触发事件的方法
    const toggleIcon = () => {
      // 切换图标状态
      isAddIconVisible.value = !isAddIconVisible.value;
      // 触发相应事件
      if (isAddIconVisible.value) {
        // 如果当前图标是添加图标，则触发事件       
      } else {
        // 如果当前图标是删除图标，则触发事件    
    }
  }

  const isAddIconLock = ref(true);//锁图标
    // 切换图标和触发事件的方法
    const toggleIconLock = () => {
      // 切换图标状态
      isAddIconLock.value = !isAddIconLock.value;
      // 触发相应事件
      if (isAddIconLock.value) {
        // 如果当前图标是添加图标，则触发事件       
      } else {
        // 如果当前图标是删除图标，则触发事件    
    }
  }

  const isAddIconAllZhankai = ref(true);//展开图标
  const toggleIconAllZhankai = () => {
      // 切换图标状态
      isAddIconAllZhankai.value = !isAddIconAllZhankai.value;
      // 触发相应事件
      if (isAddIconAllZhankai.value) {
        // 如果当前图标是添加图标，则触发事件       
      } else {
        // 如果当前图标是删除图标，则触发事件    
    }
  }

  const isAddIconsearch = ref(true);//搜索图标的点击更改图标
  const toggleIconsearch = () => {
      // 切换图标状态
      isAddIconsearch.value = !isAddIconsearch.value;
      // 触发相应事件
      if (isAddIconsearch.value) {
            
      } else {
           
    }
  }

   let getdata: Tree={   //用来接受当前树节点值的变量
    id: 1,
  label: "wrong excute",
  children: [
    {
      id: 2,
      label: "Child 1",
     isSelect: ref(false)

    }]
  }

    //用来接收当前树节点的Node
 let parentNode: Partial<Node> = {};
  let lockDelete: number=0;  //两个变量，锁增加节点函数与删除节点函数。
  let lockAdd: number=0;    


const isAddIconBeselect = ref(true);//区分树的某个节点是否被选中
  const toggleIconSelect = (dataList :Tree,data :Node) => {
      
    
    
    
    // 切换图标状态
    isAddIconBeselect.value = !isAddIconBeselect.value;
      // 触发相应事件
      if (isAddIconBeselect.value) {
        lockDelete=0;//上锁
        lockAdd=0;
            console.log('111')
      } else {
           
reDataAndKeyClick(dataList,data);
    lockDelete = 1;
    lockAdd = 1;
    }
  }




  
//下面是单独对树组件的构建
import type Node from 'element-plus/es/components/tree/src/model/node'

interface Tree {
  id: number
  [label: string] :any         
  children?: Tree[]
  isSelect?: Ref<boolean>;
}
const treeRef = ref<InstanceType<typeof ElTree>>();
  const filterText = ref('');//这个值用作el-tree的筛选
watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.label.includes(value)
}

let id = 1000

const append = (data: Tree,name: string) => {
  
      
  
  
  if(lockAdd===0)
  {
     return;
  }
  const newChild = { id: id++, label: name, children: [] ,isSelect: ref(false)}
  if (!data.children) {
    data.children = []
  }
  data.children.push(newChild)
  dataSource.value = [...dataSource.value]
    lockAdd=0;//重新上锁

}




const remove = (node: Node, data: Tree) => {
  if(lockDelete===0)
  {
     return;
  }
  const parent = node.parent
  const children: Tree[] = parent.data.children || parent.data
  const index = children.findIndex((d) => d.id === data.id)
  children.splice(index, 1)
  dataSource.value = [...dataSource.value]
}
const getCheckedNodes=(data: Tree)=>{    //一个节点被选中时，返回这个结点
  getdata=data

}
const getCheckedNodesParent=(data: Node)=>{    //返回node
         parentNode=data  

}

const dataSource = ref<Tree[]>([
  {
    id: 1,
    label: 'Level one 1',
    isSelect: ref(false)
  },
])


const reDataAndKeyClick=(dataList :Tree,data :Node) =>{  //选中点击事件1
    getCheckedNodes(dataList);
    getCheckedNodesParent(data);
    lockDelete=1;
    lockAdd=1;     //解锁，使得删除与增加可工作
    
}


const showGreateDialog=()=>{
       if(lockAdd===0)
       {
        return;//这里也应该有个小弹窗“未选中，请先选中对象
       }
       else
       {
        dialogFormVisible.value = true;
       }

}






  //树状组件创建节点时出现对话框
 let dialogFormVisible = ref(false)
const formLabelWidth = '140px'

//对话框中的小输入框
let inputValue = ref<string>('');
let storeInputValue: string;
    // 样式设计
    const inputStyle: CSSProperties = {
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      width: '100px',
      fontSize: '16px',
    };
  

    const clickconfirm=()=>{
             if(inputValue.value==='')
               {
                  //应该出现一个弹窗“文件名不可为空”
                  return;
               }
               else
               {
                storeInputValue=inputValue.value;
                append(getdata,storeInputValue);
                dialogFormVisible.value = false;
                inputValue.value='';
               }

    }




</script>







<template>
      
         <div class="GraphCommand"><!-- 图像管理部分主题框架 -->
        <div class="Up-box">
        
       
           <!-- <div class="custom-button-group"> -->
  <button class="custom-button ">部件</button> 
  <button class="custom-button ">项目</button> <!-- 小号 -->
<!-- </div> -->

      </div>
      <div class="Search-box"><!--第二层，是否禁用搜索，搜索框 四个小图标  -->
<button class="custom-button " @click="toggleIconsearch" title="按文字过滤">
  <img v-if="isAddIconsearch"   src="/src/assets/search.svg"  />
    <img v-else src="/src/assets/banSearch.svg"  />
</button> 
<div class="Search-box">
 <el-input
    v-model="filterText"
    style="width: 240px"
    placeholder="Filter keyword"
  />
  
</div>

      </div>

      <div class="ViewAndLock-box"> <!--第三层，可视，锁住等等  -->
 <button class="custom-button "  @click="toggleIcon" title="显示/隐藏全部"> 
<img v-if="isAddIconVisible" src="/src/assets/view.svg"  />
    <img v-else src="/src/assets/viewHide.svg"  />
</button> 



<button class="custom-button " @click="toggleIconLock"  title="锁定/解锁全部">
  <img v-if="isAddIconLock" src="/src/assets/unlock.svg"  />
    <img v-else src="/src/assets/lock.svg"  />
</button> 

<button class="custom-button "  @click="toggleIconAllZhankai" title="折叠/展开全部">
  <!-- <img src='/src/assets/AllZhankai.svg'/> -->
  <img v-if="isAddIconAllZhankai" src="/src/assets/AllZhedie.svg"  />
    <img v-else src="/src/assets/AllZhankai.svg"  />
</button> 

<button class="custom-button " title="所选状态展开零件树">
  <img src='/src/assets/ZhanKaiLingjianTree.svg'/>
  
</button> 

  <div class="right-aligned-button">
      <button class="custom-button  custom-button-small"  title="显示面板菜单栏">
  <img src='/src/assets/BujianShezhi.svg'/>
</button> 

  </div>   

</div>


    <!--第四层，树状部分-->  
      <div class="mainBody-box">


        <el-dialog v-model="dialogFormVisible"
     title="创建文件"
      width="500"
        draggable=true
           >
        <input
    v-model="inputValue"
    type="text"
    :style="inputStyle"
    placeholder="输入文件名字"
  />

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="clickconfirm">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>

<!-- draggable:可拖拽     -->
     <el-tree
      style="max-width: 600px"
      ref="treeRef"
      class="filter-tree"
      :data="dataSource"
      :filter-node-method="filterNode"
      highlight-current
      node-key="id"
      default-expand-all
      draggable
       
      :expand-on-click-node="false"
    >
      <template #default="{ node, data,isSelect }">
        <span class="custom-tree-node">
          <span>
            <button class="custom-button" @click="toggleIconSelect(data,node)"> 
            <img v-if="isAddIconBeselect" src="/src/assets/notBeselect.svg"  />
    <img v-else src="/src/assets/Beselect.svg"  />
            </button>
           
          </span>

          <span>{{ node.label }}</span>
        </span>
      </template>
    </el-tree>
   
  </div>
     

       




      


<!--第五层，添加，删除-->
        <div class="downCandD-box">

<button class="custom-button " title="新部件" @click="showGreateDialog" >
  <img src='/src/assets/fileAdd.svg'/>
</button> 
<button class="custom-button " title="删除选定元素" @click="remove(parentNode as Node,getdata)"><!--这里as Node的写法虽然不够严谨，但仅仅有关于节点的内容，对图层应该没有影响.....-->
<img src='/src/assets/fileDelete.svg'/>
</button> 
         
        </div>
      
     
      </div>
</template>



<style scoped lang="scss">
.custom-button {
  background-color: #eaeff3; /* 设置按钮背景颜色 */
  color: #070707; /* 设置按钮文本颜色 */
  border: none; /* 去除按钮边框 */
  padding: 0px 2px; /* 设置按钮内边距 */
  margin-right: 0px; /* 设置按钮之间的右边距 */
  border-radius: 5px; 
   font-size: 8px; 
  cursor: pointer; /* 设置鼠标样式为手型 */
  outline: none; /* 去除按钮聚焦时的边框 */
  border: 1px solid #000000; /* 添加黑色边框线 */
}

.custom-button:hover {
  background-color: #25ccea; /* 设置鼠标悬停时的背景颜色 */
}

.custom-button-medium {
  font-size: 8px; /* 设置按钮文本大小 */
}

.custom-button-small {
  font-size: 25px; /* 设置按钮文本大小 */
}




.GraphCommand{
background-color: var(--el-color-primary-light-8 );
  height: 500px;
  display: flex;
  width:195px;
   flex-direction: column; 
   border: 1px solid #4b96c2; /* 添加边框线 */
   border-radius: 5px; 

  .Up-box{
background-color: var(--el-color-success-light-8 );
  height: 30px;
  display: flex;
  width:195px;
  border: 1px solid #4b96c2; /* 添加边框线 */
   border-radius: 5px; 

.custom-button-group {
  display: flex;
}

  }

  .Search-box{
background-color: var(--el-color-warning-light-8 );
height: 30px;
display: flex;
  width:195px;
  border: 1px solid #4b96c2; /* 添加边框线 */
   border-radius: 5px; 
     .custom-input {
  padding: 5px 10px; /* 设置输入框内边距 */
  border: 1px solid #131212; /* 设置输入框边框样式 */
  border-radius: 5px; /* 设置输入框边框圆角 */
  width: 80px; /* 设置输入框宽度 */
  outline: none; /* 去除输入框聚焦时的边框 */
}
  }

  .ViewAndLock-box{
      background-color: var(--el-color-info-light-8 );
      height: 30px;
      display: flex;
      width:195px;
      border: 1px solid #4b96c2; /* 添加边框线 */
   border-radius: 5px; 
  .right-aligned-button {
    height: 30px;
  margin-left: auto; /* 将右对齐按钮向右移动 */
}
  }


  .mainBody-box{
background-color:#fcfcfcf7;
  height: 380px;
display: flex;
  width:195px;
  border: 1px solid #4b96c2; /* 添加边框线 */
   border-radius: 5px; 
   overflow: auto; /* 添加滚动条 */ 

.mainBody-box::-webkit-scrollbar {
  width: 6px; /* 宽度可调整 */
}

.mainBody-box::-webkit-scrollbar-track {
  background-color: transparent;
}

.mainBody-box::-webkit-scrollbar-thumb {
  background-color: #ccc; /* 滚动条颜色 */
  border-radius: 3px;
}

.mainBody-box::-webkit-scrollbar-thumb:hover {
  background-color: #aaa; /* 滚动条 hover 时颜色 */
}

/* 水平滚动条靠底部 */
.mainBody-box::-webkit-scrollbar {
  height: 6px; /* 高度可调整 */
}

.mainBody-box::-webkit-scrollbar-track {
  background-color: transparent;
}

.mainBody-box::-webkit-scrollbar-thumb {
  background-color: #ccc; /* 滚动条颜色 */
  border-radius: 3px;
}

.mainBody-box::-webkit-scrollbar-thumb:hover {
  background-color: #aaa; /* 滚动条 hover 时颜色 */
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}



  }

  .downCandD-box{                 
background-color: var(--el-color-warning-light-8 );
  height: 30px;
  display: flex;
  width:195px;
justify-content: flex-end; /* 右对齐 */
border: 1px solid #4b96c2; /* 添加边框线 */
   border-radius: 5px; 

  }
}

</style>
