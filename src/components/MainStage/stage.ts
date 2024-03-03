import Konva from "konva";
import Rect = Konva.Rect;
import Layer = Konva.Layer;
import {Root} from "../TreeStruct/LayerTree.ts";
import {Ref, watch} from "vue";

class MainStage extends Konva.Stage {
    unWatchDraggable
    unWatchResize

    /**
     *
     * @param container stage舞台容器
     * @param rect stage的大小矩形，响应式
     * @param root stage所依托的root，即project的信息
     * @param shouldDrag 舞台是否可以被拖动
     */
    constructor(container: HTMLDivElement, rect: Ref<{
        width: number,
        height: number
    }>, root: Root, shouldDrag: Ref<boolean>) {
        super({
            container: container,
            width: rect.value.width,
            height: rect.value.height
        });
        /**
         * 观察是否可以拖动
         */
        this.unWatchDraggable = watch(shouldDrag, (value) => {
            this.setDraggable(value);
        })
        this.unWatchResize = watch(rect, (value) => {
            this.width(value.width)
            this.height(value.height)
        }, {deep: true})
        /**
         * 鼠标滚动时候的默认方法
         */
        this.on('wheel', (e) => {
            e.evt.preventDefault();
            let oldScale = this.scaleX()
            let pointerPosition = this.getPointerPosition()
            if (pointerPosition == null) return
            let point = {
                x: (pointerPosition.x - this.x()) / oldScale,
                y: (pointerPosition.y - this.y()) / oldScale
            }
            let direction = e.evt.deltaY > 0 ? 1 : -1
            const s = 1.1;
            let newScale = direction > 0 ? oldScale * s : oldScale / s;
            this.scale({
                x: newScale,
                y: newScale
            })
            let newP = {
                x: pointerPosition.x - point.x * newScale,
                y: pointerPosition.y - point.y * newScale
            }
            this.position(newP)
        })
        /**
         * 添加背景
         */
        const backGround = new Rect({
            width: root.rect.width,
            height: root.rect.height,
            fill: '#f6f6f6'
        })
        const backGroundLayer = new Layer()
        backGroundLayer.add(backGround);
        this.add(backGroundLayer);
        /**
         * 匹配画布大小
         */
        const scaleH = this.height() / root.rect.height;
        const scaleW = this.width() / root.rect.width;
        const scale = scaleH >= scaleW ? scaleW : scaleH;
        this.scale({
            x: scale,
            y: scale
        })
        const realWidth = root.rect.width*scale;
        const realHeight = root.rect.height*scale;
        this.position({
            x: this.width()/2-realWidth/2,
            y: this.height()/2 - realHeight/2,
        })
    }


    destroy(): this {
        this.unWatchResize();
        this.unWatchDraggable();
        return super.destroy();
    }

}

export default MainStage