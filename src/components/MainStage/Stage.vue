<script lang="ts" setup>
import * as PIXI from "pixi.js";

</script>

<template>
    <div class="stage">
        
    </div>
</template>

<style lang='scss'>
.stage{
    $padding-stage: 20px;
    padding: calc($padding-stage / 2);
    height: calc(100% - $padding-stage);
    width: calc(100% - $padding-stage);
    background-color: var(--el-menu-bg-color);
}
</style>