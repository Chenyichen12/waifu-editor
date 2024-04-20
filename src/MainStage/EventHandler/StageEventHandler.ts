/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-04 12:44:56
 */

import { Graphics, Matrix } from "pixi.js"
import StageApp from "../StageApp"
import StageLayer from "../LayerBase/StageLayer"
import { result } from "./LayerEventHandler"
import { xy } from "../TwoDType"
import RectInSelected from "../GraphicsBase/RectInSelected"
import { MorpherEventRes } from "../Morpher/MorpherEventHandler"

enum StageEventRes {
    DEFAULT,
    DRAG_STAGE,

    SELECT_LAYER,
    CLICK,
    NOHITPOINT,
    NOHIT,

    DRAG_ITEM,

    SELECT_RECT_MOVE
}
abstract class StageEventHandler {

    protected clickTimeOut?: number
    handleClickEvent(_e: MouseEvent): StageEventRes {
        return StageEventRes.DEFAULT
    }
    handleMouseDownEvent(e: MouseEvent): StageEventRes {
        this.clickTimeOut = setTimeout(() => {
            this.handleLongPressEvent(e)
            this.clickTimeOut = undefined;
        }, 100)
        return StageEventRes.DEFAULT
    }
    handleLongPressEvent(_e: MouseEvent): StageEventRes {
        return StageEventRes.DEFAULT
    }

    handleMouseMoveEvent(_e: MouseEvent): StageEventRes { return StageEventRes.DEFAULT }
    handleMouseUpEvent(e: MouseEvent): StageEventRes {
        if (this.clickTimeOut != undefined) {
            clearTimeout(this.clickTimeOut);
            this.handleClickEvent(e);
            return StageEventRes.CLICK;
        }
        return StageEventRes.DEFAULT
    }

    handleKeyDownEvent(_e: KeyboardEvent): StageEventRes { return StageEventRes.DEFAULT }
    handleKeyUpEvent(_e: KeyboardEvent): StageEventRes { return StageEventRes.DEFAULT }
    handleWheelEvent(e: WheelEvent): StageEventRes {
        e.preventDefault();
        const stage = this.context.stage;
        const stagePos = stage.toLocal({ x: e.offsetX, y: e.offsetY });
        const oldZoom = stage.scale.x
        const scale = e.deltaY > 0 ? oldZoom * 0.95 : oldZoom * 1.05;
        const oldDx = stagePos.x * oldZoom - stagePos.x * scale;
        const oldDy = stagePos.y * oldZoom - stagePos.y * scale;

        this.context.appScale.value = scale;
        stage.setFromMatrix(
            new Matrix(scale, 0, 0, scale,
                stage.position.x + oldDx, stage.position.y + oldDy
            )
        );
        return StageEventRes.DEFAULT
    }

    context: StageApp // 事件处理的App实例
    constructor(context: StageApp) {
        this.context = context;
    }
    /**
     * 切换到对应的状态
     * @param state 切换状态目标 
     */
    changeToState(state: StageEventHandler) {
        this.context.eventHandler = state;
        state.stateEffect(this);
    }
    /**
     * 切换状态的目标副作用，在其他的状态进入该状态的时候自动触发该方法
     * @param _preState 先前的状态
     */
    protected stateEffect(_preState: StageEventHandler) { return }

    toStagePos(x: number, y: number) {
        return this.context.stage.toLocal({ x, y });
    }
}

class SelectedEventHandler extends StageEventHandler {
    handleKeyDownEvent(e: KeyboardEvent): StageEventRes {
        if (e.code === "Space") {
            const newState = new DragStageEventHandler(this.context);
            this.changeToState(newState);
        }
        return super.handleKeyDownEvent(e);
    }
    handleLongPressEvent(e: MouseEvent): StageEventRes {

        for (const child of this.context.morpherContainer.selectedMorpher) {
            const res = child.eventHandler.handleMouseLongPressEvent(e);
            if (res == MorpherEventRes.CHANGE_DRAG_POINT) { return StageEventRes.DEFAULT }
        }

        const stagePos = this.toStagePos(e.offsetX, e.offsetY);
        for (const selectedLayer of this.context.layerContainer.selectedLayer) {
            const layerPos = selectedLayer.transformFormStage(stagePos);
            const res = selectedLayer.mouseState.handleLongPressEvent({
                point: layerPos,
                mouseEvent: e
            })
            if (res == result.TRANSFORM_DRAG) {
                return StageEventRes.DEFAULT;
            }
            if (res == result.TRANSFORM_DRAG_RECT) {
                return StageEventRes.DEFAULT;
            }
        }

        this.changeToState(new RectSelectEventHandler(stagePos, this.context));
        return StageEventRes.DEFAULT;
    }

    handleClickEvent(e: MouseEvent): StageEventRes {
        const stagePos = this.toStagePos(e.offsetX, e.offsetY);

        const hitMorpher = this.context.morpherContainer.pointHitSelectMorpher(stagePos);
        if (hitMorpher == undefined && !e.shiftKey) {
            this.context.morpherContainer.removeAllSelect();
        }

        if (hitMorpher != undefined) {
            const res = hitMorpher.eventHandler.handleMouseClickEvent(e);
            if (res == MorpherEventRes.HIT_POINT) { return StageEventRes.DEFAULT }
        }

        const hitSelect = this.context.layerContainer.pointHitSelectedLayer(stagePos);

        if (hitSelect == undefined) {
            const hitLayer = this.context.layerContainer.pointHitLayer(stagePos);
            if (!e.shiftKey) {
                this.context.layerContainer.removeAllSelected();
            }
            if (hitLayer != undefined) {
                if (hitLayer.morpherParent != undefined) {
                    this.context.morpherContainer.addSelectMorpher(hitLayer.morpherParent);
                }
                else {
                    this.context.layerContainer.addSelected([hitLayer]);
                }
                return StageEventRes.SELECT_LAYER;
            }
            return StageEventRes.DEFAULT;
        }
        if (!e.shiftKey) {
            const noSelect: StageLayer[] = [];
            this.context.layerContainer.selectedLayer.forEach((v) => {
                if (v != hitSelect) {
                    noSelect.push(v);
                }
            })
            this.context.layerContainer.removeSelected(noSelect);
        }

        hitSelect.mouseState.handleMouseClickEvent({
            point: hitSelect.transformFormStage(stagePos),
            mouseEvent: e
        });

        return StageEventRes.DEFAULT;
    }

    handleMouseMoveEvent(e: MouseEvent): StageEventRes {
        const stagePos = this.toStagePos(e.offsetX, e.offsetY);
        let ifInRect = false;

        for (const child of this.context.layerContainer.selectedLayer) {
            const res = child.mouseState.handleMouseMoveEvent({
                point: child.transformFormStage(stagePos),
                mouseEvent: e
            })
            if (res == result.DRAG_ITEM || res == result.DRAG_RECT) {
                return StageEventRes.DEFAULT;
            }

            if (RectInSelected.ifHitRect(child.mesh.selectedPoints, child.transformFormStage(stagePos))) {
                ifInRect = true;
            }
        }
        this.context.containerDom.style.cursor = ifInRect ? "move" : "default";
        for (const morpher of this.context.morpherContainer.selectedMorpher) {
            const res = morpher.eventHandler.handleMouseMoveEvent(e);
            if (res != MorpherEventRes.DEFAUT) {
                return StageEventRes.DEFAULT;
            }
        }

        return StageEventRes.DEFAULT;

    }
    handleMouseUpEvent(e: MouseEvent): StageEventRes {
        if (super.handleMouseUpEvent(e) == StageEventRes.CLICK) {
            return StageEventRes.CLICK
        };

        for (const child of this.context.morpherContainer.selectedMorpher) {
            child.eventHandler.handleMouseUpEvent(e);
        }
        const stagePos = this.toStagePos(e.offsetX, e.offsetY)
        for (const child of this.context.layerContainer.selectedLayer) {
            const p = child.transformFormStage(stagePos);
            child.mouseState.handleMouseUpEvent({
                point: p,
                mouseEvent: e
            })
        }
        return StageEventRes.DEFAULT;
    }
}


class RectSelectEventHandler extends StageEventHandler {
    selectRect: Graphics

    firstPoint: xy
    movePoint: xy
    constructor(firstPoint: xy, context: StageApp) {
        super(context);
        this.selectRect = new Graphics();
        context.stage.addChild(this.selectRect);
        this.selectRect.zIndex = context.stage.children.length;
        this.firstPoint = firstPoint;
        this.movePoint = firstPoint;
    }
    handleMouseDownEvent(_e: MouseEvent): StageEventRes {
        return StageEventRes.DEFAULT;
    }

    handleMouseMoveEvent(e: MouseEvent): StageEventRes {
        this.movePoint = this.toStagePos(e.offsetX, e.offsetY);
        this.upDate();
        return StageEventRes.SELECT_RECT_MOVE;
    }

    handleMouseUpEvent(e: MouseEvent): StageEventRes {
        const stagePos = this.toStagePos(e.offsetX, e.offsetY)
        for (const child of this.context.layerContainer.selectedLayer) {
            const point = child.transformFormStage(stagePos);
            const { x, y, width, height } = this.getRect();
            const p1 = child.transformFormStage({ x, y });
            const p2 = child.transformFormStage({ x: x + width, y });
            const p3 = child.transformFormStage({ x: x + width, y: y + height })
            const p4 = child.transformFormStage({ x, y: y + height });
            const rec = { p1, p2, p3, p4 }
            const ifAdd = child.mouseState.handleRectSelect({
                point, mouseEvent: e
            }, rec);
            if (ifAdd == result.ADD_SELECT) {
                const remove: StageLayer[] = [];
                this.context.layerContainer.selectedLayer.forEach((v) => {
                    if (v !== child) {
                        remove.push(v);
                    }
                })
                this.context.layerContainer.removeSelected(remove);
                this.changeToState(new SelectedEventHandler(this.context));
                return StageEventRes.DEFAULT
            }
        }

        const hitSelect = this.context.layerContainer.pointHitSelectedLayer(this.firstPoint);
        if (hitSelect == undefined) {
            this.context.layerContainer.removeAllSelected();
        } else {
            const remove: StageLayer[] = [];
            this.context.layerContainer.selectedLayer.forEach((v) => {
                if (v !== hitSelect) {
                    remove.push(v);
                }
            })
            this.context.layerContainer.removeSelected(remove);
        }

        this.changeToState(new SelectedEventHandler(this.context));
        return StageEventRes.DEFAULT
    }

    upDate() {
        this.selectRect.clear();
        const { x, y, width, height } = this.getRect();
        this.selectRect.rect(x, y, width, height).fill({
            alpha: 0.3,
            color: 0xc0c0c0
        }).stroke({
            color: 0xc0c0c0,
            width: 2 / this.context.appScale.value
        });
    }
    protected getRect() {
        const x = this.firstPoint.x < this.movePoint.x ? this.firstPoint.x : this.movePoint.x;
        const y = this.firstPoint.y < this.movePoint.y ? this.firstPoint.y : this.movePoint.y;
        return {
            x, y,
            width: Math.abs(this.firstPoint.x - this.movePoint.x),
            height: Math.abs(this.firstPoint.y - this.movePoint.y)
        }
    }

    changeToState(state: StageEventHandler): void {
        this.selectRect.destroy();
        super.changeToState(state);
    }
}
class DragStageEventHandler extends StageEventHandler {
    isMousePress: boolean = false
    /**当空格被提起的时候退出拖动模式 */
    handleKeyUpEvent(e: KeyboardEvent): StageEventRes {
        if (e.code === "Space") {
            const newState = new SelectedEventHandler(this.context);
            this.changeToState(newState);
            newState.handleKeyUpEvent(e);
        }
        return StageEventRes.DEFAULT
    }
    /**
     * 当鼠标按下的时候说明要开始拖动了
     */
    handleMouseDownEvent(_e: MouseEvent): StageEventRes {
        this.isMousePress = true;
        return StageEventRes.DEFAULT
    }

    handleMouseUpEvent(_e: MouseEvent): StageEventRes {
        this.isMousePress = false;
        return StageEventRes.DEFAULT
    }
    /**拖动Stage */
    handleMouseMoveEvent(e: MouseEvent): StageEventRes {
        if (!this.isMousePress) return StageEventRes.DEFAULT;
        this.context.stage.x += e.movementX;
        this.context.stage.y += e.movementY;
        return StageEventRes.DRAG_STAGE
    }
    /**进入这个状态的时候鼠标指针变成手形 */
    stateEffect(_preState: StageEventHandler): void {
        this.context.containerDom.style.cursor = "pointer"
    }
    /**退出状态的时候鼠标指针变化 */
    changeToState(state: StageEventHandler): void {
        super.changeToState(state);
        this.context.containerDom.style.cursor = "default"
    }
}

export default StageEventHandler

export { SelectedEventHandler, StageEventRes, RectSelectEventHandler, DragStageEventHandler }