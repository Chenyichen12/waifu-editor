/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-11 20:18:32
 */
import { Container } from "pixi.js";
import Morpher from "./Morpher";
import { instanceApp } from "../StageApp";
import StageLayer from "../LayerBase/StageLayer";
import RectMorpher from "./RectMorpher";

class MorpherContainer extends Container {
    protected morphers: Morpher[];
    protected selectedMorphers = new Set<Morpher>();
    constructor(morphers: Morpher[]) {
        super();
        this.morphers = morphers;
    }

    addRectMorphers(xDot: number, yDot: number) {
        const selectedLayer = instanceApp.value!.layerContainer.selectedLayer;
        const select = [...this.selectedMorphers, ...selectedLayer];
        if (select.length == 0) {
            return
        }
        let parent: Morpher | undefined;
        const child: (StageLayer | Morpher)[] = []
        for (const sLayer of select) {
            const temp = this.findParentMorpher(sLayer);
            if (temp !== undefined) {
                if (parent === undefined || parent === temp) {
                    parent == temp;
                } else {
                    throw Error("所选择的图层存在不同的父变形器，无法为其创建变形器")
                }
            }
        }
        const newRectMorpher = new RectMorpher({
            children: select,
            meshDot: { xDot, yDot }
        })

        if (parent != undefined) {
            parent.children.filter((v) => {
                return !child.includes(v)
            })
            parent.children.push(newRectMorpher);
        }

        this.morphers.push(newRectMorpher);
        // return () => {
        //     this.addChild(newRectMorpher);
        // }
        setTimeout(() => {
            this.addChild(newRectMorpher)
        }, 10)
    }

    protected findParentMorpher(layer: StageLayer | Morpher): Morpher | undefined {
        for (const m of this.morphers) {
            if (m.children.includes(layer)) {
                return m;
            }
        }
        return undefined;
    }
}

export default MorpherContainer;