<!--
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-03-30 11:34:21
-->
<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import Project from "../Project/Project";
import StageApp, { instanceApp } from '../../MainStage/StageApp'
const stageDomRef = ref<HTMLDivElement | null>(null)

watch(Project.instance, (v) => {
    if (v == null) return;
    if (instanceApp.value != null)
        instanceApp.value.destroy();
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
onMounted(async () => {
})
</script>

<template>
    <div class="container" tabindex="1" @keydown="handleKeyDown" @keyup="handleKeyUp">
        <div class="stage" ref="stageDomRef"></div>
    </div>
</template>

<style lang='scss' scoped>
.container {
    $padding-stage: 20px;
    padding: calc($padding-stage / 2);
    height: calc(100% - $padding-stage);
    width: calc(100% - $padding-stage);
    background-color: var(--el-menu-bg-color);
    outline-color: var(--el-color-primary);
}

.stage {
    height: 100%;
    width: 100%;
}
</style>