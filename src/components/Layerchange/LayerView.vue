<!--
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-05-06 09:25:14
-->
<script lang="ts" setup>
import { Ref, provide, ref, watch } from 'vue';
import Project from '../Project/Project';
import EntryManager from './EntryManager';
import NestedDirective from './NestedDirective.vue';
import { Entry } from './Entry';
const manager: Ref<EntryManager | undefined> = ref(undefined);
provide("layerManager", manager);
watch(Project.instance, (v) => {
    if (v == null) {
        return
    }
    manager.value = v.treeEntryManager.value;
    v.onSelectionChange((v) => {
        function removeSelect(child: Entry[]) {
            for (const c of child) {
                if (v.includes(c.id)) {
                    c.isSelect = true;
                } else {
                    c.isSelect = false;
                }
                if (c.children.length != 0) {
                    removeSelect(c.children);
                }
            }
        }

        removeSelect(manager.value!.children);
    })
})

</script>

<template>
    <NestedDirective v-if="manager != undefined" v-model="manager.children"></NestedDirective>
</template>