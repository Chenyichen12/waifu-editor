/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-03-30 00:45:35
 * 
 * 用于处理Application的最外层的事件，鼠标事件和键盘事件
 */


import { Graphics, Matrix, alphaFrag } from "pixi.js";
import StageApp from "../StageApp";
import StageLayer from "../LayerBase/StageLayer";

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

class StageNormalEvent extends StageEventState {

	/**
	 * 处理键盘点击，当有空格的时候进入dragStage，当有Shift的时候进入ShiftState，空格的优先级更高
	 * @param e 浏览器事件
	 */
	handleKeyDown(e: KeyboardEvent): void {
		if (e.code === "Space") {
			const newState = new StageDragEvent(this.context);
			this.changeToState(newState);
			newState.handleKeyDown(e)
			return;
		}

		if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
			const newState = new StageMutiSelectEvent(this.context);
			this.changeToState(newState);
			newState.handleKeyDown(e)
			return;
		}
	}

	/**
	 * 鼠标点击事件，只能选择一个GraphicsLayer
	 * @param e 浏览器事件
	 * @returns 
	 */
	handleMouseDown(e: MouseEvent): void {
		const stagePos = this.toStagePos(e.offsetX, e.offsetY)

		//首先遍历选中的图层
		let prevent = false;
		for (const selectChild of this.context.selectedLayer.value) {
			const point = selectChild.transformFormStage(stagePos);

			if (selectChild.hitLayerRect(point)) {
				//选中的图层派发事件
				prevent = selectChild.mouseState.handleMouseDownEvent({ point })?.prevent ?? false;
				//其他图层需要去除选中
				this.context.selectedLayer.value = [selectChild];
				break;
			}
		}

		if (prevent)
			return;

		//清除所有选中的图层并重新选择图层
		// this.context.selectedLayer.value = [];
		// for (const child of this.context.childLayer) {
		// 	const point = child.transformFormStage(stagePos);
		// 	if (child.hitLayer(point)) {
		// 		this.context.selectedLayer.value = [child]
		// 		break;
		// 	}
		// }
		this.changeToState(new RectSelectedMode(this.context));
		this.context.eventHandler.handleMouseDown(e);
	}

	/**在鼠标移动的时候可以选择是否显示TempMesh即显示alpha为0.5的网格，在Debug的时候有用处，不过应该消耗性能 */
	protected showTempLayer: StageLayer | undefined
	protected shouldShowTempLayer: boolean = false
	handleMouseMove(e: MouseEvent): void {
		let prevent = false;
		this.context.selectedLayer.value.forEach((item) => {
			const point = {
				x: e.movementX / this.context.appScale.value,
				y: e.movementY / this.context.appScale.value
			}
			const res = item.mouseState.handleMouseMoveEvent({
				point
			})
			//选中的图层正在处理事件，阻止显示TempMesh
			if (res != undefined && res.prevent == true)
				prevent = true
		});
		if (prevent) return;
		//修改showShowTempLayer决定是否开启tempLayer
		if (this.shouldShowTempLayer) {
			let hasHitLayer = false;
			for (const tempMesh of this.context.childLayer) {
				const point = tempMesh.transformFormStage(this.toStagePos(e.offsetX, e.offsetY));
				if (tempMesh.hitLayer(point)) {
					if (tempMesh == this.showTempLayer) {
						hasHitLayer = true;
						break;
					}
					this.showTempLayer?.showTempMesh(false);
					this.showTempLayer = tempMesh;
					this.showTempLayer.showTempMesh(true);
					hasHitLayer = true;
					break;
				}
			}
			if (!hasHitLayer) {
				this.showTempLayer?.showTempMesh(false);
				this.showTempLayer = undefined;
			}
		}
	}

	/**
	 * 当鼠标提起的时候，给所有选中的图层派发事件
	 * @param e 鼠标事件
	 */
	handleMouseUp(e: MouseEvent): void {
		this.context.selectedLayer.value.forEach((item) => {
			item.mouseState.handleMouseUpEvent({
				point: item.transformFormStage(this.toStagePos(e.offsetX, e.offsetY))
			})
		})
	}
}

/**
 * 拖动Stage的事件处理
 */
class StageDragEvent extends StageEventState {
	isMousePress: boolean = false
	/**当空格被提起的时候退出拖动模式 */
	handleKeyUp(e: KeyboardEvent): void {
		if (e.code === "Space") {
			const newState = new StageNormalEvent(this.context);
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

/**
 * 多选状态
 */
class StageMutiSelectEvent extends StageEventState {

	handleKeyUp(e: KeyboardEvent): void {
		//当Shift提起的时候说明退出多选状态
		if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
			const newState = new StageNormalEvent(this.context);
			this.changeToState(newState);
			newState.handleKeyUp(e);
		}
	}

	handleMouseDown(e: MouseEvent): void {
		const StagePos = this.toStagePos(e.offsetX, e.offsetY);
		/**给选中的图层派发事件 */
		for (const item of this.context.selectedLayer.value) {
			const point = item.transformFormStage(StagePos);
			if (item.hitLayerRect(point)) {
				item.mouseState.handleMouseDownEvent({
					modifyKey: "ShiftLeft",
					point
				})
				return;
			}
		}

		/**如果没有命中选择图层，说明需要选择其他图层 */
		for (const item of this.context.childLayer) {
			const point = item.transformFormStage(StagePos);
			if (item.hitLayer(point)) {
				this.context.selectedLayer.value = [...this.context.selectedLayer.value, item];
				break;
			}
		}
	}
}
class RectSelectedMode extends StageEventState {
	protected firstDragPoint?: { x: number, y: number };
	protected movePoint?: { x: number, y: number };
	protected rect: Graphics;

	constructor(context: StageApp) {
		super(context);
		this.rect = new Graphics();
		this.rect.fillStyle = {
			alpha: 0.3,
			color: 0xc0c0c0
		}
		context.stage.addChild(this.rect);
	}
	handleMouseDown(e: MouseEvent): void {
		this.firstDragPoint = this.toStagePos(e.offsetX, e.offsetY);
	}

	handleMouseMove(e: MouseEvent): void {
		this.movePoint = this.toStagePos(e.offsetX, e.offsetY);
		this.upDateRect();
	}

	upDateRect(): void {
		if (this.firstDragPoint == undefined || this.movePoint == undefined)
			return;
		this.rect.clear();
		const start: { x: number, y: number } = { x: 0, y: 0 };
		start.x = this.firstDragPoint.x < this.movePoint.x ? this.firstDragPoint.x : this.movePoint.x;
		start.y = this.firstDragPoint.y < this.movePoint.y ? this.firstDragPoint.y : this.movePoint.y;
		this.rect.rect(start.x, start.y,
			Math.abs(this.firstDragPoint.x - this.movePoint.x), Math.abs(this.firstDragPoint.y - this.movePoint.y)).fill().stroke({
				width: 1 / this.context.appScale.value,
				color: 0xc0c0c0,
			});
	}
	handleMouseUp(_e: MouseEvent): void {
		this.rect.destroy();
		this.changeToState(new StageNormalEvent(this.context));
	}
}
export default StageEventState

export { StageNormalEvent, StageDragEvent, StageMutiSelectEvent }
