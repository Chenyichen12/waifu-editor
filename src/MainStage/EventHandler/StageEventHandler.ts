import { Matrix } from "pixi.js";
import StageApp from "../StageApp";
import StageLayer from "../LayerBase/StageLayer";

abstract class StageEventState {
    context: StageApp
    constructor(context: StageApp) {
        this.context = context;
    }

    changeToState(state: StageEventState) {
        this.context.eventHandler = state;
        state.stateEffect(this);
    }
    stateEffect(_preState: StageEventState) { return }
    handleMouseDown(_e: MouseEvent): void { return }
    handleMouseUp(_e: MouseEvent): void { return }
    handleMouseMove(_e: MouseEvent): void { return }
    handleKeyDown(_e: KeyboardEvent): void { return }
    handleKeyUp(_e: KeyboardEvent): void { return }

    handleWheelChange(e: WheelEvent) {
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
    }

    toStagePos(x: number, y: number) {
        return this.context.stage.toLocal({ x, y });
    }
}

class StageNormalEvent extends StageEventState {

    tempMeshToShow: StageLayer | undefined
    handleKeyDown(e: KeyboardEvent): void {
        if (e.code === "Space") {
            const newState = new StageDragEvent(this.context);
            this.changeToState(newState);
            newState.handleKeyDown(e)
        }

        if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
            const newState = new StageMutiSelectEvent(this.context);
            this.changeToState(newState);
            newState.handleKeyDown(e)
        }
    }

    handleMouseDown(e: MouseEvent): void {
        const stagePos = this.toStagePos(e.offsetX, e.offsetY)

        for (const selectChild of this.context.selectedLayer.value) {
            const point = selectChild.transformFormStage(stagePos);

            if (selectChild.hitLayerRect(point)) {
                selectChild.mouseState.handleMouseDownEvent({ point });
                //其他图层需要去除选中
                this.context.selectedLayer.value = this.context.selectedLayer.value.filter((v) => {
                    return v === selectChild;
                });
                return;
            }
        }

        this.context.selectedLayer.value = [];
        for (const child of this.context.childLayer) {
            const point = child.transformFormStage(stagePos);
            if (child.hitLayer(point)) {
                this.context.selectedLayer.value = [child]
                break;
            }
        }
    }

    handleMouseMove(e: MouseEvent): void {
        let showTempFlag = true;
        this.context.selectedLayer.value.forEach((item) => {
            const point = {
                x: e.movementX / this.context.appScale.value,
                y: e.movementY / this.context.appScale.value
            }
            const res = item.mouseState.handleMouseMoveEvent({
                point
            })
            if (res != undefined && res.prevent) {
                showTempFlag = false
            }
        });
        if (showTempFlag) {
            const stagePos = this.toStagePos(e.offsetX, e.offsetY);
            for (const child of this.context.childLayer) {
                if (child.selected) continue;
                const point = child.transformFormStage(stagePos);
                if (child.hitLayer(point)) {
                    if (this.tempMeshToShow === child)
                        return;
                    this.tempMeshToShow?.showTempMesh(false)
                    this.tempMeshToShow = child;
                    this.tempMeshToShow.showTempMesh(true);
                    return;
                }
            }
            this.tempMeshToShow?.showTempMesh(false);
        }
    }
    handleMouseUp(e: MouseEvent): void {
        this.context.selectedLayer.value.forEach((item) => {
            item.mouseState.handleMouseUpEvent({
                point: item.transformFormStage(this.toStagePos(e.offsetX, e.offsetY))
            })
        })
    }
}

class StageDragEvent extends StageEventState {
    isMousePress: boolean = false
    handleKeyUp(e: KeyboardEvent): void {
        if (e.code === "Space") {
            const newState = new StageNormalEvent(this.context);
            this.changeToState(newState);
            newState.handleKeyUp(e);
        }
    }

    handleMouseDown(_e: MouseEvent): void {
        this.isMousePress = true;
    }

    handleMouseUp(_e: MouseEvent): void {
        this.isMousePress = false;
    }

    handleMouseMove(e: MouseEvent): void {
        if (!this.isMousePress) return;
        this.context.stage.x += e.movementX;
        this.context.stage.y += e.movementY;
    }
    stateEffect(_preState: StageEventState): void {
        this.context.containerDom.style.cursor = "pointer"
    }
    changeToState(state: StageEventState): void {
        super.changeToState(state);
        this.context.containerDom.style.cursor = "default"
    }

}

class StageMutiSelectEvent extends StageEventState {
    handleKeyUp(e: KeyboardEvent): void {
        if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
            const newState = new StageNormalEvent(this.context);
            this.changeToState(newState);
            newState.handleKeyUp(e);
        }
    }

    handleMouseDown(e: MouseEvent): void {

    }
}

export default StageEventState

export { StageNormalEvent, StageDragEvent, StageMutiSelectEvent }