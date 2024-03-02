import {ref, Ref, ShallowRef} from "vue";
import { v4 as uuid } from 'uuid';
import {ImageAssert, rect} from "../Project/ProjectAsserts.ts";

abstract class Layer {
    name
    isSelected
    isVisible
    layerId
    abstract readonly type: string

    protected constructor(name: Ref<string>, isSelected = ref(false), isVisible = ref(true)) {
        this.name = name;
        this.isSelected = isSelected;
        this.isVisible = isVisible;
        this.layerId = uuid()
    }
}

class Group extends Layer {
    readonly type: string = "Group";
    children

    constructor(name: Ref<string>, c: ShallowRef<Layer[]>, isSelected = ref(false), isVisible = ref(true)) {
        super(name, isSelected, isVisible);
        this.children = c;
        this.type = "Group"
    }
}

class Root extends Group {
    readonly type = "Root"
    readonly isVisible = ref(true);
    readonly isSelected = ref(false)
    rect:rect

    constructor(name: Ref<string>,r:rect, c: ShallowRef<Layer[]>,) {
        super(name, c);
        this.rect = r;
    }
}

class NormalLayer extends Layer {
    readonly type = "Normal"
    assert

    constructor(name: Ref<string>, assert: Ref<ImageAssert>, isSelected = ref(false), isVisible = ref(true)) {
        super(name, isSelected, isVisible);
        this.assert = assert
    }
}

export {NormalLayer,Group,Root,Layer}