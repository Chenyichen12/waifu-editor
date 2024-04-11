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
    children: (StageLayer | Morpher)[] = []
    readonly morpherId: string
    abstract get points(): xy[]

    constructor(option: Partial<Morpher>) {
        super();
        this.children = option.children ?? [];
        this.morpherId = option.morpherId ?? uuid();
    }

    upDate(): void { };
}

export default Morpher;
export type { MorpherOption }