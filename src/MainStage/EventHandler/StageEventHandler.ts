/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-03-30 00:45:35
 * 
 * 用于处理Application的最外层的事件，鼠标事件和键盘事件
 */


import { Matrix } from "pixi.js";
import StageApp from "../StageApp";
import StageLayer from "../LayerBase/StageLayer";
import { handleType } from "./LayerEventHandler";
import { xy } from "../TwoDType";

/**
 * 事件处理的基类
 */
abstract class StageEventState {
	context: StageApp // 事件处理的App实例
	constructor(context: StageApp) {
		this.context = context;
	}

	/**
	 * 切换到对应的状态
	 * @param state 切换状态目标 
	 */
	changeToState(state: StageEventState) {
		this.context.eventHandler = state;
		state.stateEffect(this);
	}
	/**
	 * 切换状态的目标副作用，在其他的状态进入该状态的时候自动触发该方法
	 * @param _preState 先前的状态
	 */
	protected stateEffect(_preState: StageEventState) { return }

	/**
	 * 处理鼠标事件和键盘事件
	 * @param _e 浏览器事件
	 */
	handleMouseDown(_e: MouseEvent): void { return }
	handleMouseUp(_e: MouseEvent): void { return }
	handleMouseMove(_e: MouseEvent): void { return }
	handleKeyDown(_e: KeyboardEvent): void { return }
	handleKeyUp(_e: KeyboardEvent): void { return }

	/**
	 * 当鼠标滚轮变化的时候需要缩放视图
	 * @param e 浏览器事件
	 */
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

	/**
	 * 将浏览器的坐标转化为当前App的Stage坐标 xy一般取 offsetX，offsetY
	 * @param x 浏览器的X坐标
	 * @param y 浏览器的Y坐标
	 * @returns Stage坐标
	 */
	toStagePos(x: number, y: number) {
		return this.context.stage.toLocal({ x, y });
	}
}

class SelectEvent extends StageEventState {
	handleMouseDown(e: MouseEvent): void {
		const layerContainer = this.context.layerContainer;

		const StagePos = this.toStagePos(e.offsetX, e.offsetY)
		const hitLayer = layerContainer.pointHitSelectedLayer(StagePos);
		if (hitLayer != undefined) {
			if (this.mouseDownToSelectedLayer(hitLayer, e, StagePos)) {
				return
			}
		}

		const unSelectedLayer = layerContainer.pointHitLayer(StagePos);
		if (!e.shiftKey) {
			this.context.layerContainer.removeAllSelected();
		}
		if (unSelectedLayer != undefined) {
			this.context.layerContainer.addSelected([unSelectedLayer])
		}
	}


	handleMouseMove(e: MouseEvent): void {
		const layerContainer = this.context.layerContainer;
		let prevent = false;
		const StagePos = this.toStagePos(e.offsetX, e.offsetY);

		layerContainer.selectedLayer.forEach((v) => {
			const res = v.mouseState.handleMouseMoveEvent({
				mouseEvent: e,
				point: v.transformFormStage(StagePos)
			})
			if (res != undefined && res.handleRes == handleType.DRAG_ITEM)
				prevent = true;
		})
	}

	handleMouseUp(e: MouseEvent): void {
		const StagePos = this.toStagePos(e.offsetX, e.offsetY);
		const layerContainer = this.context.layerContainer;
		layerContainer.selectedLayer.forEach((v) => {
			v.mouseState.handleMouseUpEvent({
				point: v.transformFormStage(StagePos),
				mouseEvent: e
			})
		})

		const hit = layerContainer.pointHitLayer(StagePos);
		if (hit != undefined) {
			hit.mouseState.handleMouseUpEvent({
				mouseEvent: e,
				point: hit.transformFormStage(StagePos)
			})
		}
	}

	protected mouseDownToSelectedLayer(layer: StageLayer, mouseEvent: MouseEvent, StagePos: xy) {
		const res = layer.mouseState.handleMouseDownEvent({
			mouseEvent,
			point: layer.transformFormStage(StagePos)
		})
		return res != undefined && (res.handleRes == handleType.HIT_POINT || res.handleRes == handleType.HIT_LINE)
	}

	handleKeyDown(e: KeyboardEvent): void {
		if (e.code === "Space") {
			const newState = new StageDragEvent(this.context);
			this.changeToState(newState);
			newState.handleKeyDown(e)
			return;
		}
	}
}

class RectSelectedState extends StageEventState {

}
class StageDragEvent extends StageEventState {
	isMousePress: boolean = false
	/**当空格被提起的时候退出拖动模式 */
	handleKeyUp(e: KeyboardEvent): void {
		if (e.code === "Space") {
			const newState = new SelectEvent(this.context);
			this.changeToState(newState);
			newState.handleKeyUp(e);
		}
	}
	/**
	 * 当鼠标按下的时候说明要开始拖动了
	 */
	handleMouseDown(_e: MouseEvent): void {
		this.isMousePress = true;
	}

	handleMouseUp(_e: MouseEvent): void {
		this.isMousePress = false;
	}
	/**拖动Stage */
	handleMouseMove(e: MouseEvent): void {
		if (!this.isMousePress) return;
		this.context.stage.x += e.movementX;
		this.context.stage.y += e.movementY;
	}
	/**进入这个状态的时候鼠标指针变成手形 */
	stateEffect(_preState: StageEventState): void {
		this.context.containerDom.style.cursor = "pointer"
	}
	/**退出状态的时候鼠标指针变化 */
	changeToState(state: StageEventState): void {
		super.changeToState(state);
		this.context.containerDom.style.cursor = "default"
	}
}
export default StageEventState

export { SelectEvent, RectSelectedState, StageDragEvent }
