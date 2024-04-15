/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-11 20:18:32
 */
import { Container } from "pixi.js";
import Morpher from "./Morpher";
import { instanceApp } from "../StageApp";
import RectMorpher from "./RectMorpher";
import { xy } from "../TwoDType";

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
            parent.removeMopherChild(select)
            parent.addMorpherChild(newRectMorpher);
            newRectMorpher.morpherParent = parent;
        }

        this.morphers.push(newRectMorpher);
        this.addChild(newRectMorpher);
        this.selectedMorphers.add(newRectMorpher)
    }

    addSelectMorpher(morphers: Morpher | Morpher[]) {
        if (morphers instanceof Array) {
            morphers.forEach((v) => {
                this.selectedMorphers.add(v);
                v.show = true;
            })
        } else {
            this.selectedMorphers.add(morphers);
            morphers.show = true;
        }
    }

    removeAllSelect() {
        this.selectedMorphers.forEach((v) => {
            v.show = false;
        })
        this.selectedMorphers.clear();
    }

    removeSelectMorpher(morpher: Morpher | Morpher[]) {
        if (morpher instanceof Array) {
            morpher.forEach((v) => {
                const move = this.selectedMorphers.delete(v);
                if (move) {
                    v.show = false;
                }
            })
        } else {
            const move = this.selectedMorphers.delete(morpher);
            if (move) {
                morpher.show = false;
            }
        }
    }

    pointHitSelectMorpher(pos: xy): Morpher | undefined {
        for (const morpher of this.selectedMorphers) {
            if (morpher.ifHitMorpher(pos.x, pos.y)) {
                return morpher;
            }
        }
    }

    get selectedMorpher() { return [...this.selectedMorphers] }
}

export default MorpherContainer;