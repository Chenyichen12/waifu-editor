<!--
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-03-30 11:34:21
-->
<script lang="ts" setup>
import { computed, onMounted, ref, shallowRef, watch } from "vue";
import Project from "../Project/Project";
import StageApp, { instanceApp } from '../../MainStage/StageApp'
import EditMeshMode from "../../MainStage/EditMeshMode/EditMeshMode";
const stageDomRef = ref<HTMLDivElement | null>(null)
const isPenClick = ref(false);
const editMode = shallowRef<EditMeshMode | undefined>(undefined);

const penReadyStyle = computed(()=>{
    if(isPenClick.value && editMode.value != undefined){
        return {
            backgroundColor: "var(--el-text-color-regular)"
        }
    }
    return {}
})


watch(Project.instance, (v) => {
    if (v == null) return;
    const stage = new StageApp(stageDomRef.value!);
    stage.initFromProject(v);
})

function handleKeyDown(e: KeyboardEvent) {
    if (instanceApp.value != null)
        instanceApp.value.eventHandler.handleKeyDownEvent(e);
}
function handleKeyUp(e: KeyboardEvent) {
    if (instanceApp.value != null)
        instanceApp.value.eventHandler.handleKeyUpEvent(e);
}

function handleEditButtonClick(_e: MouseEvent){
    if(instanceApp.value != null){
        editMode.value = instanceApp.value.createEditMode();
        editMode.value.enterEdit();
    }
}

function handleLeaveButtonClick(_e: MouseEvent){
    if(editMode.value != undefined){
        editMode.value.leaveEdit();
    }
}

function handlePenButtonClick(){
    // if(isPenReady.value == undefined){
    //     return;
    // }else{
    //     isPenClick.value = !isPenClick.value;
    //     isPenReady.value(isPenClick.value);
    // }
    if(editMode.value!=undefined){
        isPenClick.value = !isPenClick.value;
        editMode.value.setPenSelect(isPenClick.value);
    }
}
onMounted(async () => {
})
</script>

<template>
    <div class = "tool-box">
        <button @click="handleEditButtonClick">进入编辑</button>
        <button @click="handleLeaveButtonClick">退出编辑</button>

        <button @click="handlePenButtonClick" v-bind:style = "penReadyStyle">
            <img src="/src/assets/vector-pen.svg" />
        </button>
    </div>
    <div class="container" tabindex="1" @keydown="handleKeyDown" @keyup="handleKeyUp">
        <div class="stage" ref="stageDomRef"></div>
    </div>
</template>

<style lang='scss' scoped>
.tool-box{
    height: 4%;
    width: 100%;
    display: flex;
}
.container {
    $padding-stage: 20px;
    padding: calc($padding-stage / 2);
    height: calc(96% - $padding-stage);
    width: calc(100% - $padding-stage);
    background-color: var(--el-menu-bg-color);
    outline-color: var(--el-color-primary);
}

.stage {
    height: 100%;
    width: 100%;
    
}
</style>