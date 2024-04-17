<!-- 暂时没用的文件，可删 -->


<template>
    <div>
        <el-button type="primary" size="small":icon="ArrowRight" class="item-button" @click="changeDown" />
        <el-button type="primary" size="small":icon="View" class="item-button" @click="changeHide"/>
    </div>
</template>

<script>
    import { ArrowRight,ArrowDown,View,Hide } from '@element-plus/icons-vue'
    import { ref } from 'vue'

    function changeDown(){
        icon = "ArrowDown"
    }
    function changeHide(){
        icon= "Hide"
    }
</script>

<style scoped>
/* Your component's CSS styles go here */
</style>