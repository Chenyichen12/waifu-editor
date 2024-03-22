import { Graphics } from "pixi.js";
import MeshPoint from "./MeshPoint";
import { Ref, ref } from "vue";
import MeshLine from "./MeshLine";

class MeshLayer extends Graphics {
    update() {

    }
    pointList: Ref<MeshPoint[]> = ref([]);
    lineList: Ref<MeshLine[]> = ref([]);
    pointAtPosition(): number {
        return 0;
    }
}
export default MeshLayer