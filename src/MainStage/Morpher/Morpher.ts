import { Graphics } from "pixi.js";
import StageLayer from "../LayerBase/StageLayer";
import { v4 as uuid } from "uuid";
import { xy } from "../TwoDType";
/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-11 10:53:44
 */

interface MorpherOption {
    id: string
    children: (StageLayer | Morpher)[]
}
abstract class Morpher extends Graphics {
    morpherParent: Morpher | undefined = undefined
    morpherChildren: (StageLayer | Morpher)[] = []
    readonly morpherId: string
    abstract get points(): xy[]

    constructor(option: Partial<MorpherOption>) {
        super();
        this.morpherChildren = option.children ?? [];
        this.morpherId = option.id ?? uuid();
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
}

export default Morpher;
export type { MorpherOption }