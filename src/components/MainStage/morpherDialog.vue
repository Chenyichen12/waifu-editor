<!--
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-05-06 14:49:24
-->
<script lang="ts" setup>
import { ref } from 'vue';

interface props {
    callBack: (name: string, xDot: number, yDot: number) => void
}

const call = defineProps<props>();
const name = ref("未命名");
const xDot = ref(3);
const yDot = ref(3);

const shouldShowDialog = ref(true);

function handleConfirm() {
    call.callBack(name.value, xDot.value, yDot.value);
}
</script>
<template>
    <el-dialog v-model="shouldShowDialog">
        <el-form>
            <el-form-item label="名字">
                <el-input v-model="name"></el-input>
            </el-form-item>
            <el-form-item label="数字1">
                <el-select v-model="xDot" placeholder="请选择">
                    <el-option v-for="item in [3, 4, 5, 6]" :key="item" :label="item" :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="数字2">
                <el-select v-model="yDot" placeholder="请选择">
                    <el-option v-for="item in [3, 4, 5, 6]" :key="item" :label="item" :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-form-item>
            <el-button type="primary" @click="handleConfirm">确认</el-button>
        </el-form-item>
    </el-dialog>
</template>