<!--
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-23 22:20:45
-->
<script setup lang="ts">
import Project from '../Project/Project';
import { Layer as MLayer, GroupLayer, PictureLayer } from './Layers';

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

function getPictureFromPictureLayer(entry: PictureLayer) {
    if (entry.url == undefined) {
        const pic = Project.instance.value?.assetList.get(entry.pictureId);
        if (pic != undefined) {
            const canvas = document.createElement('canvas');
            const imageData = new ImageData(pic.array!, pic.bound.width, pic.bound.height);

            canvas.width = pic.bound.width;
            canvas.height = pic.bound.height;

            const ctx = canvas.getContext('2d');
            if (ctx != undefined) {
                ctx.putImageData(imageData, 0, 0);
            }

            const url = canvas.toDataURL("image/png", 0.4);

            return url;
        } else {
            throw Error("没找到图片");
        }
    } else {
        return entry.url
    }
}

function handleDirExpandClick(id: string) {
    const item = model.value.find((v) => v.id === id);
    if (item != undefined && "isExpand" in item) {
        item.isExpand = !item.isExpand
    }
}
</script>

<template>
    <div v-for="(entry) in model">
        <div v-if="ifGroup(entry)" :style="paddingLeft()">
            <div class="listEntry">
                <div class="previewDir">
                    <img src="/src/assets/IntreeFileOpen.svg" v-show="(entry as GroupLayer).isExpand">
                    <img src="/src/assets/IntreeFileFload.svg" v-show="!(entry as GroupLayer).isExpand">
                    <a>{{ showName(entry.name) }}</a>
                </div>
                <img src="/src/assets/IntrreeChevronRight.svg" v-show="!(entry as GroupLayer).isExpand"
                    class="dirExpandIcon" @click="() => handleDirExpandClick(entry.id)">
                <img src="/src/assets/IntreeChevronDown.svg" v-show="(entry as GroupLayer).isExpand"
                    class="dirExpandIcon" @click="() => handleDirExpandClick(entry.id)">
            </div>

            <Layer v-model="(entry as GroupLayer).children" :howDeep="props.howDeep + 1"
                v-if="(entry as GroupLayer).isExpand"></Layer>
        </div>
        <div v-else :style="paddingLeft()" class="listEntry">
            <div class="preview">
                <img :src="getPictureFromPictureLayer((entry as PictureLayer))" :width="10" :height="10">
                <a>{{ showName(entry.name) }}</a>
            </div>
            <img src="/src/assets/view.svg" v-show="entry.isShow" class="eyeIcon">
            <img src="/src/assets/viewHide.svg" v-show="!entry.isShow" class="eyeIcon">
        </div>
    </div>
</template>

<style lang="scss" scoped>
.listEntry {
    display: flex;
    justify-content: space-between;

    &:hover {
        background-color: var(--el-color-primary-light-7);
    }

    .preview {
        display: flex;
        align-items: center;
        margin: 4px;

        img {
            padding: 10px;
            border: 1px solid black;
        }

        a {
            margin-left: 10px;
        }
    }

    .previewDir {
        display: flex;
        align-items: center;
        margin: 4px;

        img {
            padding: 5px;
            width: 15px;
            height: 15px;
        }

        a {
            margin-left: 10px
        }
    }

    .eyeIcon {
        align-self: center;
        margin-right: 10px;
        width: 15px;
        height: 15px;
    }

    .dirExpandIcon {
        align-self: center;
        margin-right: 10px;
        width: 15px;
        height: 15px;
    }
}
</style>