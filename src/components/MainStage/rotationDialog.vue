<!--
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-05-06 14:49:24
-->
<script lang="ts" setup>
import { ref } from 'vue';

interface props {
    callBack: (name: string) => void
}

const call = defineProps<props>();
const name = ref("未命名");

const shouldShowDialog = ref(true);

function handleConfirm() {
    call.callBack(name.value);
}
</script>
<template>
    <el-dialog v-model="shouldShowDialog">
        <el-form>
            <el-form-item label="名字">
                <el-input v-model="name"></el-input>
            </el-form-item>
        </el-form>
        <el-form-item>
            <el-button type="primary" @click="handleConfirm">确认</el-button>
        </el-form-item>
    </el-dialog>
</template>