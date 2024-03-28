import { Application } from "pixi.js";
import StageLayer from "./LayerBase/StageLayer";
import { ref, shallowRef, watch } from "vue";
import StageEventState, { StageNormalEvent } from "./EventHandler/StageEventHandler";

const instanceApp = shallowRef<StageApp | null>(null)
class StageApp extends Application {
    protected stageDom
    public selectedLayer
    protected unWatchSelected

    appScale = ref(1)

    eventHandler: StageEventState = new StageNormalEvent(this);

    constructor(dom: HTMLDivElement) {
        super();
        this.stageDom = dom;
        this.stage.interactive = true;
        this.selectedLayer = shallowRef<StageLayer[]>([]);
        this.unWatchSelected = watch(this.selectedLayer, (newV, oldV) => {
            oldV.forEach((item) => {
                item.selected = false;
            })
            newV.forEach((item) => {
                item.selected = true;
            })
        })
        instanceApp.value = this;
    }
}

export default StageApp
export { instanceApp }