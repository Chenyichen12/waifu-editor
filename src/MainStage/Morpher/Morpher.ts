import { Graphics } from "pixi.js";
import StageLayer from "../LayerBase/StageLayer";
import { v4 as uuid } from "uuid";
import { xy } from "../TwoDType";
/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-11 10:53:44
 */


interface MorpherChild {
    data: StageLayer | Morpher
}
interface MorpherOption {
    id: string
    children: (StageLayer | Morpher)[]
    morpherParent: Morpher
}
abstract class Morpher extends Graphics {
    morpherParent: Morpher | undefined
    protected _morpherChildren: MorpherChild[] = []
    readonly morpherId: string
    abstract get points(): xy[]

    constructor(option: Partial<MorpherOption>) {
        super();
        if (option.children != undefined) {
            this._morpherChildren = option.children.map((v) => {
                return {
                    data: v
                }
            })
        }
        this.morpherId = option.id ?? uuid();
        this.morpherParent = option.morpherParent ?? undefined;
    }

    protected _show: boolean = true;

    set show(ifShow: boolean) {
        this._show = ifShow
        this.visible = ifShow;
    }

    get show() {
        return this._show;
    }

    shallowUpDate(): void { };
    protected deepUpDate(): void { }

    abstract pointAtPosition(x: number, y: number): number | undefined
    abstract ifHitMorpher(x: number, y: number): boolean

    abstract setFromPointList(pointList: xy[]): void
    abstract removeMopherChild(child: (Morpher | StageLayer) | (Morpher | StageLayer)[]): void
    abstract addMorpherChild(child: Morpher | StageLayer): void


}

export default Morpher;
export type { MorpherOption, MorpherChild }