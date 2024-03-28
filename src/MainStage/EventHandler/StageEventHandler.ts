import StageApp from "../StageApp";

abstract class StageEventState {
    context: StageApp
    constructor(context: StageApp) {
        this.context = context;
    }
    changeToState(state: StageEventState) {
        this.context.eventHandler = state;
    }

    handleMouseDown(_e: MouseEvent): void { return }
    handleMouseUp(_e: MouseEvent): void { return }
    handleMouseMove(_e: MouseEvent): void { return }
    handleKeyDown(_e: KeyboardEvent): void { return }
    handleKeyUp(_e: KeyboardEvent): void { return }

    handleWheelChange(e: WheelEvent) {

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