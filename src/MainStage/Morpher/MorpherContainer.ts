/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-11 20:18:32
 */
import { Container } from "pixi.js";
import Morpher from "./Morpher";
import { instanceApp } from "../StageApp";
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

        const parent: Morpher | undefined = select[0].morpherParent;
        for (const sLayer of select) {
            if (sLayer.morpherParent !== parent) {
                throw Error("所选择的图层存在不同的父变形器，无法为其创建变形器");
            }
        }

        const newRectMorpher = new RectMorpher({
            children: select,
            meshDot: { xDot, yDot }
        })

        for (const sLayer of select) {
            sLayer.morpherParent = newRectMorpher;
        }
        if (parent != undefined) {
            parent.morpherChildren.filter((v) => {
                return !select.includes(v)
            })
            parent.morpherChildren.push(newRectMorpher);
            newRectMorpher.morpherParent = parent;
        }

        this.morphers.push(newRectMorpher);
        this.addChild(newRectMorpher);
    }

}

export default MorpherContainer;