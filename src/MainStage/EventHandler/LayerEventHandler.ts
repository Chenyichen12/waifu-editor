/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-03-30 08:46:47
 * 
 * 用于处理LayerStage的事件，处理键盘事件
 */

import MeshLine from "../GraphicsBase/MeshLine"
import MeshPoint from "../GraphicsBase/MeshPoint"
import StageLayer from "../LayerBase/StageLayer"

type localPos = { x: number, y: number }

interface LayerEventOption {
    point: localPos, // layer的局部坐标，和Stage的坐标不同 可以用StageLayer的transformFormStage转换
    modifyKey?: string, // 修饰键
}

/**
 * 事件处理回馈
 * prevent： 是否阻止Stage的事件处理
 */
interface result {
    prevent: boolean
}
/**
 * StageLayer 处理鼠标事件抽象类
 * 仅在selected的时候才会派发这一类的事件
 */
abstract class LayerEventState {
    handleMouseDownEvent(_option: LayerEventOption): result | undefined { return }
    handleMouseMoveEvent(_option: LayerEventOption): result | undefined { return }
    handleMouseUpEvent(_option: LayerEventOption): result | undefined { return }


    context: StageLayer
    constructor(context: StageLayer) {
        this.context = context;
    }
}

/**
 * 在StageLayer非编辑状态下（正常状态下） 处理鼠标事件
 */
class LayerNormalState extends LayerEventState {
    protected meshTarget //正常状态下对应的mesh目标
    protected isMousePress = false
    protected dragItem: MeshPoint | undefined // 当前正在拖动的点

    /**
     * 鼠标按下之后处理，如果Shift按下说明多选，转化到多选模式
     * @param option 事件信息
     */
    handleMouseDownEvent(option: LayerEventOption): undefined {
        if (option.modifyKey == "ShiftLeft" || option.modifyKey == "ShiftRight") {
            this.changeToMutiState();
            this.context.mouseState.handleMouseDownEvent(option);
            return;
        }
        this.selectOneItem(option.point);

        this.isMousePress = true;
    }

    /**
     * 鼠标移动的事件，当鼠标没有按下或者选中的点的数量不是1，说明不能拖动点 直接返回
     * 反之直接对点进行拖动
     * @param option 事件信息
     * @returns 当正在拖动的时候阻止StageEventHandle处理MouseMoveEvent
     */
    handleMouseMoveEvent(option: LayerEventOption): result {
        if (this.dragItem == undefined || !this.isMousePress) {
            return { prevent: false }
        }

        const move = option.point
        this.dragItem.setPosition(this.dragItem.x + move.x, this.dragItem.y + move.y);
        this.upDatePosition();
        return { prevent: true }
    }

    /**
     * 处理point是否命中mesh中的点，如果命中点需要改变dragItem
     * 这个状态只能命中一个item，需要清除所有选中的item
     * @param point 事件点
     */
    protected selectOneItem(point: localPos) {
        const p = this.meshTarget.pointAtPosition(point.x, point.y);
        this.dragItem = p; // 改变dragItem
        let l: MeshLine | undefined
        if (p == undefined)
            l = this.meshTarget.lineAtPosition(point.x, point.y);
        this.meshTarget.removeAllSelected();
        this.meshTarget.addSelected(
            p != undefined ? [p] : [],
            l != undefined ? [l] : []
        )

    }

    /**
     * 当鼠标提起的时候改变MousePress
     * @param _option 
     */
    handleMouseUpEvent(_option: LayerEventOption): undefined {
        this.isMousePress = false;
    }

    /**
     * 拖动点的时候由于point改变，需要update
     */
    upDatePosition() {
        this.meshTarget.upDate();
        this.context.textureLayer.upDatePositionBuffer(this.meshTarget.listPoint);
    }

    /**
     * 转化到多选模式
     */
    changeToMutiState() {
        this.context.mouseState = new LayerMutiSelectedState(this.context);
    }


    constructor(context: StageLayer) {
        super(context);
        this.meshTarget = context.mesh
    }
}

class LayerMutiSelectedState extends LayerEventState {
    protected meshTarget // 编辑对象

    /**
     * 当发现Shift键不是修饰键时，立刻转化为Normal状态并触发handleMouseDown
     * @param option 事件信息
     */
    handleMouseDownEvent(option: LayerEventOption): undefined {
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

    /**
     * 转化到普通状态
     */
    changeToNormalState() {
        this.context.mouseState = new LayerNormalState(this.context);
    }

    /**
     * 多选Item
     * @param point 位置信息
     */
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