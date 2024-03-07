import Project from "../Project/Project";
import * as PIXI from "pixi.js";
import {rect} from "../Project/ProjectAsserts";

class StageApp {
    static pixiApp: PIXI.Application
    static isMousePress = false
    static isSpacePress = false

    private constructor() {
    }

    static async create(stageDomRef: HTMLDivElement) {
        if (Project.instance.value?.root == null) {
            return
        }
        //先销毁一开始的app
        for (let child of stageDomRef.children) {
            stageDomRef.removeChild(child);
        }
        StageApp.pixiApp.destroy();

        StageApp.pixiApp = new PIXI.Application();
        await StageApp.pixiApp.init(({
            background: "#4BC1F0",
            resizeTo: stageDomRef
        }));
        StageApp.pixiApp.stage.interactive = true

        stageDomRef.appendChild(StageApp.pixiApp.canvas);
        const projectRoot = Project.instance.value.root;
        const projectRect = projectRoot.rect;
        StageApp.addBg(projectRect);

        const scaleX = StageApp.pixiApp.screen.width / projectRect.width;
        const scaleY = StageApp.pixiApp.screen.height / projectRect.height;
        const scale = scaleX > scaleY ? scaleY : scaleX;
        const scaleAfterX = projectRect.width * scale
        const scaleAfterY = projectRect.height * scale
        StageApp.pixiApp.stage.scale.set(scale)
        StageApp.pixiApp.stage.position.set(StageApp.pixiApp.screen.width / 2 - scaleAfterX / 2, StageApp.pixiApp.screen.height / 2 - scaleAfterY / 2)

        StageApp.pixiApp.canvas.onmousedown = () => {
            StageApp.isMousePress = true
        }
        StageApp.pixiApp.stage.onmouseup = () => {
            StageApp.isMousePress = false
        }
        StageApp.pixiApp.canvas.onmousemove = (e) => {
            if (StageApp.isSpacePress && StageApp.isMousePress) {
                StageApp.pixiApp.stage.position.x += e.movementX;
                StageApp.pixiApp.stage.position.y += e.movementY;
            }
        }
        StageApp.pixiApp.canvas.onwheel = StageApp.onWheelChange;
    }

    protected static addBg(rect: rect) {
        const bg = new PIXI.Graphics();
        bg.rect(0, 0, rect.width, rect.height);
        bg.fill(0xECECEC)
        StageApp.pixiApp.stage.addChild(bg);
    }

    protected static onWheelChange(e: WheelEvent) {
        const thisApp = StageApp.pixiApp;
        const stagePos = thisApp.stage.toLocal({x: e.offsetX, y: e.offsetY});
        const oldZoom = thisApp.stage.scale.x
        const scale = e.deltaY > 0 ? oldZoom * 0.9 : oldZoom * 1.1;
        const oldDx = stagePos.x * oldZoom - stagePos.x * scale;
        const oldDy = stagePos.y * oldZoom - stagePos.y * scale;
        thisApp.stage.scale.set(scale);
        thisApp.stage.position.x += oldDx;
        thisApp.stage.position.y += oldDy
    }
}

export default StageApp