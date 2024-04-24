<!--
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-23 17:31:29
-->
<script setup lang="ts">
import { provide, ref, watch } from 'vue';
import { Layer, GroupLayer, PictureLayer } from './Layers';
import LayerSilder from "./Layer.vue"
import Project from '../Project/Project';
import { Group, NormalLayer } from '../Project/LayerStruct';

const RootGroup = ref<GroupLayer | undefined>(undefined);

const selectLayer = ref<string[] | undefined>(undefined);

const onSelectionChange = (entry: string[]) => {
    if (RootGroup.value == undefined) {
        return;
    }
    addSelect(RootGroup.value);
    function addSelect(layer: GroupLayer) {
        for (const child of layer.children) {
            if (entry.includes(child.id)) {
                child.isSelect = true;
            } else {
                child.isSelect = false;
            }
            if ("children" in child) {
                addSelect((child as GroupLayer));
            }
        }
    }
}

watch(Project.instance, (value) => {
    if (value == null) {
        RootGroup.value = undefined
        return;
    }
    const addEntry = (layer: Group): Layer[] => {
        const res: Layer[] = [];
        for (const child of layer.children.value) {
            if (child instanceof NormalLayer) {
                res.push(new PictureLayer({ id: child.layerId, name: child.name.value, isShow: child.isVisible.value }, child.assetId));
            } else {
                const g = new GroupLayer({ id: child.layerId, name: child.name.value, isShow: child.isVisible.value }, (child as Group).isExpand.value);
                g.children = addEntry(child as Group);
                res.push(g);
            }
        }

        return res;
    }
    const c = addEntry(value.root);
    RootGroup.value = new GroupLayer({
        id: "1",
        name: "root",
        isShow: true
    }, true);
    RootGroup.value.children = c;
    selectLayer.value = value.currentSelectedLayer;
    value.onSelectionChange(onSelectionChange);
})

provide("selectedLayer", selectLayer);

watch(selectLayer, (value) => {
    if (RootGroup.value != undefined && value != undefined) {
        Project.instance.value!.currentSelectedLayer = value!;
    }
})

</script>

<template>
    <LayerSilder v-if="RootGroup != undefined" v-model="RootGroup.children" :howDeep="0"></LayerSilder>
</template>