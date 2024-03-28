import StageApp from "../StageApp";

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
        stage.scale.set(scale);
        this.context.appScale.value = scale;
        stage.position.x += oldDx;
        stage.position.y += oldDy
    }
}

class StageNormalEvent extends StageEventState {
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