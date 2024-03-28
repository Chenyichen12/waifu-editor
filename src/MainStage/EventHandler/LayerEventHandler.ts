import StageLayer from "../LayerBase/StageLayer"

type localPos = { x: number, y: number }

interface LayerEventOption {
    point: localPos,
    modifyKey?: string,
}
abstract class LayerEventState {
    handleMouseDownEvent(_option: LayerEventOption) { return }
    handleMouseMoveEvent(_option: LayerEventOption) { return }
    handleMouseUpEvent(_option: LayerEventOption) { return }


    context: StageLayer
    constructor(context: StageLayer) {
        this.context = context;
    }
}

class LayerNormalState extends LayerEventState {
    protected meshTarget
    protected isMousePress = false
    handleMouseDownEvent(option: LayerEventOption): void {
        if (option.modifyKey == "ShiftLeft" || option.modifyKey == "ShiftRight") {
            this.changeToMutiState();
            this.context.mouseState.handleMouseDownEvent(option);
            return;
        }
        this.selectOneItem(option.point);
        this.isMousePress = true;
    }
    handleMouseMoveEvent(option: LayerEventOption): void {
        if (this.meshTarget.selectedPoints.length != 1 || !this.isMousePress) {
            return
        }
        const point = this.meshTarget.selectedPoints[0];
        const move = option.point
        point.setPosition(point.x + move.x, point.y + move.y);
        this.upDatePosition();
    }
    selectOneItem(point: localPos) {
        const p = this.meshTarget.pointAtPosition(point.x, point.y);
        const l = this.meshTarget.lineAtPosition(point.x, point.y);
        this.meshTarget.removeAllSelected();
        this.meshTarget.addSelected(
            p != undefined ? [p] : [],
            l != undefined ? [l] : []
        )

    }

    handleMouseUpEvent(_option: LayerEventOption): void {
        this.isMousePress = true;
    }
    upDatePosition() {
        this.meshTarget.upDate();
        this.context.textureLayer.upDatePositionBuffer(this.meshTarget.listPoint);
    }
    changeToMutiState() {
        this.context.mouseState = new LayerMutiSelectedState(this.context);
    }
    constructor(context: StageLayer) {
        super(context);
        this.meshTarget = context.mesh
    }
}

class LayerMutiSelectedState extends LayerEventState {
    protected meshTarget
    handleMouseDownEvent(option: LayerEventOption): void {
        if (option.modifyKey != "ShiftLeft" && option.modifyKey != "ShiftRight") {
            this.changeToNormalState();
            this.context.mouseState.handleMouseDownEvent(option);
            return;
        }
        this.selectMutiItem(option.point);
    }

    constructor(context: StageLayer) {
        super(context);
        this.meshTarget = context.mesh;
    }

    changeToNormalState() {
        this.context.mouseState = new LayerNormalState(this.context);
    }
    selectMutiItem(point: localPos) {
        const p = this.meshTarget.pointAtPosition(point.x, point.y);
        const l = this.meshTarget.lineAtPosition(point.x, point.y);
        this.meshTarget.addSelected(
            p != undefined ? [p] : [],
            l != undefined ? [l] : []
        )
    }
}
export default LayerEventState

export { LayerNormalState, LayerMutiSelectedState }