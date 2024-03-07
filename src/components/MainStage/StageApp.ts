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
        this.pixiApp = new PIXI.Application();
        await this.pixiApp.init(({
            background: "#4BC1F0",
            resizeTo: stageDomRef
        }));
        this.pixiApp.stage.interactive = true
        for (let child of stageDomRef.children) {
            stageDomRef.removeChild(child);
        }
        stageDomRef.appendChild(this.pixiApp.canvas);
        const projectRoot = Project.instance.value.root;
        const projectRect = projectRoot.rect;
        this.addBg(projectRect);

        const scaleX = this.pixiApp.screen.width / projectRect.width;
        const scaleY = this.pixiApp.screen.height / projectRect.height;
        const scale = scaleX > scaleY ? scaleY : scaleX;
        const scaleAfterX = projectRect.width*scale
        const scaleAfterY = projectRect.height*scale
        this.pixiApp.stage.scale.set(scale)
        this.pixiApp.stage.position.set(this.pixiApp.screen.width/2-scaleAfterX/2,this.pixiApp.screen.height/2-scaleAfterY/2)
        
        this.pixiApp.canvas.onmousedown = () => {
            this.isMousePress = true
        }
        this.pixiApp.stage.onmouseup = () => {
            this.isMousePress = false
        }
        this.pixiApp.canvas.onmousemove = (e) => {
            if (this.isSpacePress && this.isMousePress) {
                this.pixiApp.stage.position.x += e.movementX;
                this.pixiApp.stage.position.y += e.movementY;
            }
        }
        this.pixiApp.canvas.onwheel = this.onWheelChange;
    }

    protected static addBg(rect: rect) {
        const bg = new PIXI.Graphics();
        bg.rect(0, 0, rect.width, rect.height);
        bg.fill(0xECECEC)
        this.pixiApp.stage.addChild(bg);
    }

    protected static onWheelChange(e:WheelEvent) {
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