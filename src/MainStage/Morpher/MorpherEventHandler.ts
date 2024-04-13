import StageEventHandler, { StageEventRes } from "../EventHandler/StageEventHandler";
import StageApp from "../StageApp";
import { rect, xy } from "../TwoDType";
import MorpherContainer from "./MorpherContainer";
import RectMorpher from "./RectMorpher";

/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-12 23:33:18
 */

abstract class MorpherEventHandler extends StageEventHandler {

    protected morpherContext: MorpherContainer
    handleRectSelect(_mouseEvent: MouseEvent, _rec: rect) { }
    constructor(context: StageApp, morpherContext: MorpherContainer) {
        super(context);
        this.morpherContext = morpherContext;
    }

}

class MorpherSelectEventHandler extends MorpherEventHandler {
    handleClickEvent(e: MouseEvent): StageEventRes {
        const point = this.toStagePos(e.offsetX, e.offsetY);
        const hitMorpher = this.morpherContext.pointHitSelectMorpher(point);
        if (hitMorpher != undefined) {
            if (hitMorpher instanceof RectMorpher) {
                const res = this.handleRectMorpherSelect(hitMorpher, point, e.shiftKey);
                return res ? StageEventRes.CLICK : StageEventRes.NOHITPOINT
            }
        }

        this.morpherContext.removeAllSelect();
        return StageEventRes.NOHIT
    }
    protected handleRectMorpherSelect(morpher: RectMorpher, point: xy, isShift: boolean): boolean {
        const index = morpher.pointAtPosition(point.x, point.y);
        if (!isShift) {
            morpher.removeAllSelect();
        }

        if (index != undefined) {
            morpher.addSelectPoint(index);
            return true;
        }
        return false;
    }
}

export default MorpherEventHandler;
export { MorpherSelectEventHandler }