<!--
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-23 22:20:45
-->
<script setup lang="ts">
import { Layer as MLayer, GroupLayer } from './Layers';

const props = defineProps<{
    howDeep: number
}>();
const model = defineModel<MLayer[]>({
    required: true
})

function ifGroup(l: MLayer) {
    return "children" in l;
}

function paddingLeft() {
    return {
        paddingLeft: `${props.howDeep * 5}px`
    }
}

function showName(name: string) {
    if (name.length < 6)
        return name;
    else
        return name.substring(0, 5) + "...";
}
</script>

<template>
    <div class="listContainer">
        <div v-for="(entry) in model">
            <div v-if="ifGroup(entry)" :style="paddingLeft()">
                {{ showName(entry.name) }}
                <Layer v-model="(entry as GroupLayer).children" :howDeep="props.howDeep + 1"></Layer>
            </div>
            <div v-else class="entry" :style="paddingLeft()">
                {{ showName(entry.name) }}
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.listContainer {
    &:hover {
        background-color: pink;
    }
}
</style>