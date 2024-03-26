import { Application, ApplicationOptions, Graphics } from "pixi.js";
import { ref, shallowRef } from "vue";
import Project from "../Project/Project";
import GraphicsLayer from "./GraphicsLayer";


const instanceApp = shallowRef<StageApp | null>(null)

class StageApp extends Application {
    isMousePress = false;
    isSpacePress = false;
    appScale = ref(1);
    stageDom
    constructor(dom: HTMLDivElement) {
        super();
        this.stageDom = dom;
        this.stage.interactive = true;
        instanceApp.value = this;
    }
    async init(options?: (Partial<ApplicationOptions> | undefined)): Promise<void> {
        if (Project.instance.value?.root == null) {
            throw new Error("NoProject");
        }
        for (let child of this.stageDom.children) {
            this.stageDom.removeChild(child);
        }
        await super.init({
            ...options,
            background: "#4BC1F0",
            resizeTo: this.stageDom,
            preference: "webgl",
        });
        this.stageDom.appendChild(this.canvas);

        const projectRoot = Project.instance.value.root;
        const projectRect = projectRoot.bound;
        this.addBg(projectRect);
        this.addSprite();

        const scaleX = this.screen.width / projectRect.width;
        const scaleY = this.screen.height / projectRect.height;
        const scale = scaleX > scaleY ? scaleY : scaleX;
        this.appScale.value = scale;
        const scaleAfterX = projectRect.width * scale
        const scaleAfterY = projectRect.height * scale
        this.stage.scale.set(scale)
        this.stage.position.set(this.screen.width / 2 - scaleAfterX / 2, this.screen.height / 2 - scaleAfterY / 2)

        this.canvas.onmousedown = () => {
            this.isMousePress = true
        }

        this.canvas.onmouseup = () => {
            this.isMousePress = false
        }
        this.canvas.onmousemove = (e) => {
            if (this.isSpacePress && this.isMousePress) {
                this.stage.position.x += e.movementX;
                this.stage.position.y += e.movementY;
            }
        }
        this.canvas.onwheel = (e) => {
            this.onWheelChange(e);
        };
    }
    protected addBg(rect: { width: number, height: number }) {
        const bg = new Graphics();
        bg.rect(0, 0, rect.width, rect.height);
        bg.fill(0xECECEC)
        this.stage.addChild(bg)
    }
    protected addSprite() {
        const list = Project.instance.value!.assetList;
        for (const item of list) {
            const gra = new GraphicsLayer({ texture: item })
            this.stage.addChild(gra);
            gra.position.set(item.bound.left, item.bound.top)
        }
    }
    protected onWheelChange(e: WheelEvent) {
        const stagePos = this.stage.toLocal({ x: e.offsetX, y: e.offsetY });
        const oldZoom = this.stage.scale.x
        const scale = e.deltaY > 0 ? oldZoom * 0.95 : oldZoom * 1.05;
        const oldDx = stagePos.x * oldZoom - stagePos.x * scale;
        const oldDy = stagePos.y * oldZoom - stagePos.y * scale;
        this.stage.scale.set(scale);
        this.appScale.value = scale;
        this.stage.position.x += oldDx;
        this.stage.position.y += oldDy
    }
}

export default StageApp
export { instanceApp }